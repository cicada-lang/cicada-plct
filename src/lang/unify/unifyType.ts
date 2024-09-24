import { indent } from "../../utils/indent.js"
import type { Closure } from "../closure/index.js"
import { closureApply } from "../closure/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxCons, ctxNames } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import { solutionAdvanceValue, solutionNames } from "../solution/index.js"
import {
  unify,
  unifyClazz,
  unifyNeutral,
  unifyPatternVar,
} from "../unify/index.js"
import { freshen } from "../utils/freshen.js"
import * as Values from "../value/index.js"
import { type Value, formatType, isClazz } from "../value/index.js"

export function unifyType(mod: Mod, ctx: Ctx, left: Value, right: Value): void {
  left = solutionAdvanceValue(mod, left)
  right = solutionAdvanceValue(mod, right)

  const success = unifyPatternVar(mod, ctx, Values.Type(), left, right)
  if (success) return

  try {
    unifyTypeAux(mod, ctx, left, right)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unifyType]`,
          indent(`left: ${formatType(mod, ctx, left)}`),
          indent(`right: ${formatType(mod, ctx, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}

function unifyTypeAux(mod: Mod, ctx: Ctx, left: Value, right: Value): void {
  if (left["@kind"] === "TypedNeutral" && right["@kind"] === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    unifyNeutral(mod, ctx, left.type, left.neutral, right.neutral)
    return
  }

  if (left["@kind"] === "Type" && right["@kind"] === "Type") {
    return
  }

  if (left["@kind"] === "String" && right["@kind"] === "String") {
    return
  }

  if (left["@kind"] === "Trivial" && right["@kind"] === "Trivial") {
    return
  }

  if (
    (left["@kind"] === "Pi" && right["@kind"] === "Pi") ||
    (left["@kind"] === "PiImplicit" && right["@kind"] === "PiImplicit")
  ) {
    unifyType(mod, ctx, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType

    const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(argType, Neutrals.Var(freshName))

    ctx = CtxCons(freshName, argType, ctx)

    unifyClosure(
      mod,
      ctx,
      right.retTypeClosure,
      left.retTypeClosure,
      v,
      freshName,
    )

    return
  }

  if (left["@kind"] === "Sigma" && right["@kind"] === "Sigma") {
    unifyType(mod, ctx, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType

    const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(carType, Neutrals.Var(freshName))

    ctx = CtxCons(freshName, carType, ctx)

    unifyClosure(
      mod,
      ctx,
      right.cdrTypeClosure,
      left.cdrTypeClosure,
      v,
      freshName,
    )

    return
  }

  if (isClazz(left) && isClazz(right)) {
    unifyClazz(mod, ctx, left, right)
    return
  }

  if (left["@kind"] === "Equal" && right["@kind"] === "Equal") {
    unifyType(mod, ctx, left.type, right.type)
    const equalType = left.type
    unify(mod, ctx, equalType, left.from, right.from)
    unify(mod, ctx, equalType, left.to, right.to)
    return
  }

  throw new Errors.UnificationError(
    [
      `[unifyType] is not implemented for the pair of type values`,
      indent(`left: ${formatType(mod, ctx, left)}`),
      indent(`right: ${formatType(mod, ctx, right)}`),
    ].join("\n"),
  )
}

/**

   # unification between two `Sigma`s

   Problem: We we must be able to solve the following equation:

   ```
   solve (A: Type, B: (x: A) -> Type) {
     exists (x: A) B(x) = exists (_: String) String
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
  left: Closure,
  right: Closure,
  v: Values.TypedNeutral,
  name: string,
): void {
  const leftRet = closureApply(left, v)
  const rightRet = closureApply(right, v)

  /**
     If after the application of the closure,
     the result value is `f(name)`,
     then we should unify `f` with the other closure as a function.
  **/

  const leftApTarget = extractApTarget(leftRet, name)
  if (leftApTarget) {
    unify(mod, ctx, leftApTarget.type, leftApTarget, Values.Fn(right))
    return
  }

  const rightApTarget = extractApTarget(rightRet, name)
  if (rightApTarget) {
    unify(mod, ctx, rightApTarget.type, rightApTarget, Values.Fn(left))
    return
  }

  unifyType(mod, ctx, leftRet, rightRet)
}

function extractApTarget(
  value: Value,
  name: string,
): Values.TypedNeutral | undefined {
  if (
    value["@kind"] === "TypedNeutral" &&
    value.neutral["@kind"] === "Ap" &&
    value.neutral.target["@kind"] === "PatternVar" &&
    value.neutral.arg.value["@kind"] === "TypedNeutral" &&
    value.neutral.arg.value.neutral["@kind"] === "Var" &&
    value.neutral.arg.value.neutral.name === name
  ) {
    return Values.TypedNeutral(value.neutral.targetType, value.neutral.target)
  }
}
