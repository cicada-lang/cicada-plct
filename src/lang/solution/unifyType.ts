import { applyClosure, Closure } from "../closure"
import { formatCore } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import {
  advanceValue,
  unify,
  unifyClazz,
  unifyNeutral,
  unifyPatternVar,
} from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { isClazz, readbackType, Value } from "../value"

export function unifyType(mod: Mod, ctx: Ctx, left: Value, right: Value): void {
  left = advanceValue(mod, left)
  right = advanceValue(mod, right)

  const success = unifyPatternVar(mod, ctx, Values.Type(), left, right)
  if (success) return

  try {
    unifyTypeAux(mod, ctx, left, right)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unifyType]`,
          `  left: ${formatCore(readbackType(mod, ctx, left))}`,
          `  right: ${formatCore(readbackType(mod, ctx, right))}`,
        ].join("\n"),
      )
    }

    throw error
  }
}

function unifyTypeAux(mod: Mod, ctx: Ctx, left: Value, right: Value): void {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    unifyNeutral(mod, ctx, left.neutral, right.neutral)
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
    unifyType(mod, ctx, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType

    const usedNames = [...ctxNames(ctx), ...mod.solution.names]
    const freshName = freshen(usedNames, name)
    const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))

    ctx = CtxCons(freshName, argType, ctx)

    unifyClosure(
      mod,
      ctx,
      right.retTypeClosure,
      left.retTypeClosure,
      typedNeutral,
      freshName,
    )

    return
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    unifyType(mod, ctx, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType

    const usedNames = [...ctxNames(ctx), ...mod.solution.names]
    const freshName = freshen(usedNames, name)
    const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))

    ctx = CtxCons(freshName, carType, ctx)

    unifyClosure(
      mod,
      ctx,
      right.cdrTypeClosure,
      left.cdrTypeClosure,
      typedNeutral,
      freshName,
    )

    return
  }

  if (isClazz(left) && isClazz(right)) {
    unifyClazz(mod, ctx, left, right)
    return
  }

  if (left.kind === "Equal" && right.kind === "Equal") {
    unifyType(mod, ctx, left.type, right.type)
    const equalType = left.type
    unify(mod, ctx, equalType, left.from, right.from)
    unify(mod, ctx, equalType, left.to, right.to)
    return
  }

  throw new Errors.UnificationError(
    [
      `unifyType is not implemented for the pair of type values`,
      `  left kind: ${formatCore(readbackType(mod, ctx, left))}`,
      `  right kind: ${formatCore(readbackType(mod, ctx, right))}`,
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
  left: Closure,
  right: Closure,
  typedNeutral: Values.TypedNeutral,
  name: string,
): void {
  const leftRet = applyClosure(left, typedNeutral)
  const rightRet = applyClosure(right, typedNeutral)

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
