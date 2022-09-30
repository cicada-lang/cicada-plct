import * as Neutrals from "../neutral"
import * as Values from "../value"
import { assertValue, isValue, Value } from "../value"

export function doCar(target: Value): Value {
  if (isValue(target, "Cons")) {
    return target.car
  }

  assertValue(target, Values.TypedNeutral)
  assertValue(target.type, Values.Sigma)

  return Values.TypedNeutral(target.type.carType, Neutrals.Car(target.neutral))
}
