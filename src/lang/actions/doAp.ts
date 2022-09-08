import { applyClosure } from "../closure"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import {
  assertValue,
  fulfillClazz,
  isClazz,
  isValue,
  TypedValue,
  Value,
} from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (isValue(target, Values.Fn)) {
    return applyClosure(target.retClosure, arg)
  }

  if (isClazz(target)) {
    return fulfillClazz(target, arg)
  }

  assertValue(target, Values.TypedNeutral)
  assertValue(target.type, Values.Pi)

  return Values.TypedNeutral(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.Ap(target.neutral, TypedValue(target.type.argType, arg)),
  )
}
