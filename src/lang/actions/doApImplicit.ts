import { applyClosure } from "../closure"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

export function doApImplicit(target: Value, arg: Value): Value {
  if (Values.isValue(target, Values.FnImplicit)) {
    return applyClosure(target.retClosure, arg)
  }

  Values.assertValue(target, Values.TypedNeutral)
  Values.assertValue(target.type, Values.PiImplicit)

  return Values.TypedNeutral(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.ApImplicit(target.neutral, TypedValue(target.type.argType, arg)),
  )
}
