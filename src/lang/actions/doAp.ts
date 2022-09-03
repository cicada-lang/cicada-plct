import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, assertValue, isValue, TypedValue, Value } from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (isValue(target, Values.Fn)) {
    return applyClosure(target.retClosure, arg)
  }

  assertValue(target, Values.TypedNeutral)
  assertValue(target.type, Values.Pi)

  return Values.TypedNeutral(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.Ap(target.neutral, TypedValue(target.type.argType, arg)),
  )
}
