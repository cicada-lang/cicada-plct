import * as Neutrals from "../neutral"
import * as Values from "../value"
import { Value } from "../value"

export function doCar(target: Value): Value {
  if (Values.isValue(target, "Cons")) {
    return target.car
  }

  Values.assertValue(target, "TypedNeutral")
  Values.assertValue(target.type, "Sigma")

  return Values.TypedNeutral(
    target.type.carType,
    Neutrals.Car(target.neutral, target.type),
  )
}
