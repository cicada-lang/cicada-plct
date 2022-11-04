import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import {
  prepareValue,
  Solution,
  unify,
  unifyClazz,
  unifyNeutral,
  unifyPatternVar,
} from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { isClazz, Value } from "../value"

export function unifyType(
  solution: Solution,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  left = prepareValue(solution, left)
  right = prepareValue(solution, right)

  const success = unifyPatternVar(solution, ctx, Values.Type(), left, right)
  if (success) return

  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    unifyNeutral(solution, ctx, left.neutral, right.neutral)
    return
  }

  if (left.kind === "Type" && right.kind === "Type") {
    return
  }

  if (left.kind === "String" && right.kind === "String") {
    return
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return
  }

  if (
    (left.kind === "Pi" && right.kind === "Pi") ||
    (left.kind === "PiImplicit" && right.kind === "PiImplicit")
  ) {
    unifyType(solution, ctx, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType

    const usedNames = [...ctxNames(ctx), ...solution.names]
    const freshName = freshen(usedNames, name)
    const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))

    ctx = CtxCons(freshName, argType, ctx)

    unifyClosure(
      solution,
      ctx,
      right.retTypeClosure,
      left.retTypeClosure,
      typedNeutral,
      freshName,
    )

    return
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    unifyType(solution, ctx, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType

    const usedNames = [...ctxNames(ctx), ...solution.names]
    const freshName = freshen(usedNames, name)
    const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))

    ctx = CtxCons(freshName, carType, ctx)

    unifyClosure(
      solution,
      ctx,
      right.cdrTypeClosure,
      left.cdrTypeClosure,
      typedNeutral,
      freshName,
    )

    return
  }

  if (isClazz(left) && isClazz(right)) {
    unifyClazz(solution, ctx, left, right)
    return
  }

  if (left.kind === "Equal" && right.kind === "Equal") {
    unifyType(solution, ctx, left.type, right.type)
    const equalType = right.type
    unify(solution, ctx, equalType, left.from, right.from)
    unify(solution, ctx, equalType, left.to, right.to)
    return
  }

  throw new Errors.UnificationError(
    `unifyType is not implemented for left: ${left.kind}, right: ${right.kind}`,
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
  solution: Solution,
  ctx: Ctx,
  left: Closure,
  right: Closure,
  typedNeutral: Values.TypedNeutral,
  name: string,
): void {
  const leftRet = applyClosure(left, typedNeutral)
  const rightRet = applyClosure(right, typedNeutral)

  const leftApTarget = extractApTarget(leftRet, name)
  if (leftApTarget) {
    unify(solution, ctx, leftApTarget.type, leftApTarget, Values.Fn(right))
    return
  }

  const rightApTarget = extractApTarget(rightRet, name)
  if (rightApTarget) {
    unify(solution, ctx, rightApTarget.type, rightApTarget, Values.Fn(left))
    return
  }

  unifyType(solution, ctx, leftRet, rightRet)
}

function extractApTarget(
  value: Value,
  name: string,
): Values.TypedNeutral | undefined {
  if (
    Values.isValue(value, "TypedNeutral") &&
    value.neutral.kind === "Ap" &&
    value.neutral.target.kind === "Var" &&
    Values.isValue(value.neutral.arg.value, "TypedNeutral") &&
    value.neutral.arg.value.neutral.kind === "Var" &&
    value.neutral.arg.value.neutral.name === name
  ) {
    return Values.TypedNeutral(value.neutral.targetType, value.neutral.target)
  }
}
