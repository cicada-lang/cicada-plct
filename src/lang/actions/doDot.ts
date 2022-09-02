import * as Values from "../value"
import { assertValue, assertValues, isValue, Value } from "../value"

export function doDot(target: Value, name: string): Value {
  if (isValue(target, Values.Objekt)) {
    throw new Error("TODO")
  }

  assertValue(target, Values.TypedNeutral)
  assertValues(target.type, [
    Values.ClazzNull,
    Values.ClazzCons,
    Values.ClazzFulfilled,
  ])

  throw new Error("TODO")
}
