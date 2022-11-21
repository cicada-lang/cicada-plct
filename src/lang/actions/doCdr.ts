import { closureApply } from "../closure"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import type { Value } from "../value"
import * as Values from "../value"
import { doCar } from "./doCar"

export function doCdr(target: Value): Value {
  return tryCdr(target) || neutralizeCdr(target)
}

export function tryCdr(target: Value): Value | undefined {
  if (target["@kind"] === "Cons") {
    return target.cdr
  }
}

export function neutralizeCdr(target: Value): Value {
  if (target["@kind"] !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeCdr] expect target to be TypedNeutral`,
        `  target["@kind"]: ${target["@kind"]}`,
      ].join("\n"),
    )
  }

  if (target.type["@kind"] !== "Sigma") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeCdr] When target is a TypedNeutral, expect target.type to be Sigma`,
        `  target.type["@kind"]: ${target.type["@kind"]}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    closureApply(target.type.cdrTypeClosure, doCar(target)),
    Neutrals.Cdr(target.neutral, target.type),
  )
}
