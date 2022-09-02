import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, assertValue, isValue, Value } from "../value"
import { doCar } from "./doCar"

export function doCdr(target: Value): Value {
  if (isValue(target, Values.Cons)) {
    return target.cdr
  }

  assertValue(target, Values.TypedNeutral)
  assertValue(target.type, Values.Sigma)

  return Values.TypedNeutral(
    applyClosure(target.type.cdrTypeClosure, doCar(target)),
    Neutrals.Cdr(target.neutral)
  )
}
