import { applyClosure } from "../closure"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (Values.isValue(target, "Fn")) {
    return applyClosure(target.retClosure, arg)
  }

  if (Values.isClazz(target)) {
    return Values.fulfillClazz(target, arg)
  }

  Values.assertValue(target, Values.TypedNeutral)
  Values.assertValue(target.type, Values.Pi)

  return Values.TypedNeutral(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.Ap(target.neutral, TypedValue(target.type.argType, arg)),
  )
}
