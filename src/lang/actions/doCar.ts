import * as Errors from "../errors/index.js"
import * as Neutrals from "../neutral/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function doCar(target: Value): Value {
  return tryCar(target) || neutralizeCar(target)
}

export function tryCar(target: Value): Value | undefined {
  if (target["@kind"] === "Cons") {
    return target.car
  }
}

export function neutralizeCar(target: Value): Value {
  if (target["@kind"] !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeCar] expect target to be TypedNeutral`,
        `  target["@kind"]: ${target["@kind"]}`,
      ].join("\n"),
    )
  }

  if (target.type["@kind"] !== "Sigma") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeCar] When target is a TypedNeutral, expect target.type to be Sigma`,
        `  target.type["@kind"]: ${target.type["@kind"]}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    target.type.carType,
    Neutrals.Car(target.neutral, target.type),
  )
}
