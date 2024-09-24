import { closureApply } from "../closure/index.js"
import * as Errors from "../errors/index.js"
import * as Neutrals from "../neutral/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"
import { TypedValue } from "../value/index.js"

export function doApImplicit(target: Value, arg: Value): Value {
  return tryApImplicit(target, arg) || neutralizeApImplicit(target, arg)
}

export function tryApImplicit(target: Value, arg: Value): Value | undefined {
  if (target["@kind"] === "FnImplicit") {
    return closureApply(target.retClosure, arg)
  }
}

export function neutralizeApImplicit(target: Value, arg: Value): Value {
  if (target["@kind"] !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeApImplicit] expect target to be TypedNeutral`,
        `  target["@kind"]: ${target["@kind"]}`,
      ].join("\n"),
    )
  }

  if (target.type["@kind"] !== "PiImplicit") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeApImplicit] When target is a TypedNeutral, expect target.type to be PiImplicit`,
        `  target.type["@kind"]: ${target.type["@kind"]}`,
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
