import * as Neutrals from "../neutral"
import * as Values from "../value"
import { assertValue, isValue, Value } from "../value"

export function doCar(target: Value): Value {
  if (isValue(target, "Cons")) {
    return target.car
  }

  assertValue(target, "TypedNeutral")
  assertValue(target.type, "Sigma")

  return Values.TypedNeutral(target.type.carType, Neutrals.Car(target.neutral, target.type))
}
