import { closureApply } from "../closure"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import type { Value } from "../value"
import * as Values from "../value"
import { TypedValue } from "../value"

export function doApImplicit(target: Value, arg: Value): Value {
  if (target.kind === "FnImplicit") {
    return closureApply(target.retClosure, arg)
  }

  if (target.kind !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[doApImplicit] expect target to be TypedNeutral`,
        `  target.kind: ${target.kind}`,
      ].join("\n"),
    )
  }

  if (target.type.kind !== "PiImplicit") {
    throw new Errors.EvaluationError(
      [
        `[doApImplicit] When target is a TypedNeutral, expect target.type to be PiImplicit`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    closureApply(target.type.retTypeClosure, arg),
    Neutrals.ApImplicit(
      target.neutral,
      target.type,
      TypedValue(target.type.argType, arg),
    ),
  )
}
