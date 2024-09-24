import { closureApply } from "../closure/index.js"
import * as Errors from "../errors/index.js"
import * as Neutrals from "../neutral/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"
import { doCar } from "./doCar.js"

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
