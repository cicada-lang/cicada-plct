import { closureApply } from "../closure"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import type { Value } from "../value"
import * as Values from "../value"
import { TypedValue } from "../value"

export function doAp(target: Value, arg: Value): Value {
  return tryAp(target, arg) || neutralizeAp(target, arg)
}

export function tryAp(target: Value, arg: Value): Value | undefined {
  if (target.kind === "Fn") {
    return closureApply(target.retClosure, arg)
  }

  if (Values.isClazz(target)) {
    return Values.clazzFulfill(target, arg)
  }
}

export function neutralizeAp(target: Value, arg: Value): Value {
  if (target.kind !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeAp] expect target to be TypedNeutral`,
        `  target.kind: ${target.kind}`,
      ].join("\n"),
    )
  }

  if (target.type.kind !== "Pi") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeAp] When target is a TypedNeutral, expect target.type to be Pi`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    closureApply(target.type.retTypeClosure, arg),
    Neutrals.Ap(
      target.neutral,
      target.type,
      TypedValue(target.type.argType, arg),
    ),
  )
}
