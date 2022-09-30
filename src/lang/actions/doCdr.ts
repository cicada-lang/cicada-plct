import { applyClosure } from "../closure"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { assertValue, isValue, Value } from "../value"
import { doCar } from "./doCar"

export function doCdr(target: Value): Value {
  if (isValue(target, "Cons")) {
    return target.cdr
  }

  assertValue(target, "TypedNeutral")
  assertValue(target.type, "Sigma")

  return Values.TypedNeutral(
    applyClosure(target.type.cdrTypeClosure, doCar(target)),
    Neutrals.Cdr(target.neutral, target.type),
  )
}
