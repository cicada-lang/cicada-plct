import { indent } from "../../utils/indent"
import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { Solution, solutionAdvanceValue, solutionNames } from "../solution"
import { unify, unifyClazz, unifyNeutral, unifyPatternVar } from "../unify"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { formatType, isClazz, Value } from "../value"

export function unifyType(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  left: Value,
  right: Value,
): Solution {
  left = solutionAdvanceValue(mod, solution, left)
  right = solutionAdvanceValue(mod, solution, right)

  const success = unifyPatternVar(
    mod,
    ctx,
    solution,
    Values.Type(),
    left,
    right,
  )
  if (success) return success

  try {
    return unifyTypeAux(mod, ctx, solution, left, right)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unifyType]`,
          indent(`left: ${formatType(mod, ctx, solution, left)}`),
          indent(`right: ${formatType(mod, ctx, solution, right)}`),
        ].join("\n"),
      )
    }

    if (error instanceof Errors.EvaluationError) {
      throw new Errors.UnificationError(
        [
          `[unifyType] EvaluationError during unification`,
          error.message,
          indent(`left: ${formatType(mod, ctx, solution, left)}`),
          indent(`right: ${formatType(mod, ctx, solution, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}

function unifyTypeAux(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  left: Value,
  right: Value,
): Solution {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    solution = unifyNeutral(mod, ctx, solution, left.neutral, right.neutral)
    return solution
  }

  if (left.kind === "Type" && right.kind === "Type") {
    return solution
  }

  if (left.kind === "String" && right.kind === "String") {
    return solution
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return solution
  }

  if (
    (left.kind === "Pi" && right.kind === "Pi") ||
    (left.kind === "PiImplicit" && right.kind === "PiImplicit")
  ) {
    solution = unifyType(mod, ctx, solution, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType
    const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(argType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, argType, ctx)
    solution = unifyClosure(
      mod,
      ctx,
      solution,
      right.retTypeClosure,
      left.retTypeClosure,
      v,
      freshName,
    )
    return solution
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    solution = unifyType(mod, ctx, solution, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType
    const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(carType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, carType, ctx)
    solution = unifyClosure(
      mod,
      ctx,
      solution,
      right.cdrTypeClosure,
      left.cdrTypeClosure,
      v,
      freshName,
    )
    return solution
  }

  if (isClazz(left) && isClazz(right)) {
    solution = unifyClazz(mod, ctx, solution, left, right)
    return solution
  }

  if (left.kind === "Equal" && right.kind === "Equal") {
    solution = unifyType(mod, ctx, solution, left.type, right.type)
    const equalType = left.type
    solution = unify(mod, ctx, solution, equalType, left.from, right.from)
    solution = unify(mod, ctx, solution, equalType, left.to, right.to)
    return solution
  }

  throw new Errors.UnificationError(
    [
      `[unifyType] is not implemented for the pair of type values`,
      indent(`left: ${formatType(mod, ctx, solution, left)}`),
      indent(`right: ${formatType(mod, ctx, solution, right)}`),
    ].join("\n"),
  )
}

/**

   # unification between two `Sigma`s

   Problem: We we must be able to solve the following equation:

   ```
   solve (A: Type, B: (x: A) -> Type) {
     unify exists (x: A) B(x) = exists (_: String) String
   }
   ```

   The same problem occurs for unification between two Pis.

   Solution: Handle unification between Sigma specially,
   to generate a const function (x: String) => String for B:

   ```
   { A: String, B: (x: String) => String }
   ```

**/

function unifyClosure(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  left: Closure,
  right: Closure,
  typedNeutral: Values.TypedNeutral,
  name: string,
): Solution {
  const leftRet = applyClosure(left, typedNeutral)
  const rightRet = applyClosure(right, typedNeutral)

  const leftApTarget = extractApTarget(leftRet, name)
  if (leftApTarget) {
    solution = unify(
      mod,
      ctx,
      solution,
      leftApTarget.type,
      leftApTarget,
      Values.Fn(right),
    )
    return solution
  }

  const rightApTarget = extractApTarget(rightRet, name)
  if (rightApTarget) {
    solution = unify(
      mod,
      ctx,
      solution,
      rightApTarget.type,
      rightApTarget,
      Values.Fn(left),
    )
    return solution
  }

  solution = unifyType(mod, ctx, solution, leftRet, rightRet)
  return solution
}

function extractApTarget(
  value: Value,
  name: string,
): Values.TypedNeutral | undefined {
  if (
    value.kind === "TypedNeutral" &&
    value.neutral.kind === "Ap" &&
    value.neutral.target.kind === "Var" &&
    value.neutral.arg.value.kind === "TypedNeutral" &&
    value.neutral.arg.value.neutral.kind === "Var" &&
    value.neutral.arg.value.neutral.name === name
  ) {
    return Values.TypedNeutral(value.neutral.targetType, value.neutral.target)
  }
}
