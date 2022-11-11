import { applyClosure } from "../closure"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

export function doApImplicit(target: Value, arg: Value): Value {
  if (target.kind === "FnImplicit") {
    return applyClosure(target.retClosure, arg)
  }

  Values.assertValue(target, "TypedNeutral")

  if (target.type.kind !== "PiImplicit") {
    throw new Errors.EvaluationError(
      [
        `[doApImplicit] When target is a TypedNeutral, expect target.type to be PiImplicit`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.ApImplicit(
      target.neutral,
      target.type,
      TypedValue(target.type.argType, arg),
    ),
  )
}
