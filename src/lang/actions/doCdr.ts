import { applyClosure } from "../closure"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { Value } from "../value"
import { doCar } from "./doCar"

export function doCdr(target: Value): Value {
  if (target.kind === "Cons") {
    return target.cdr
  }

  Values.assertValue(target, "TypedNeutral")
  Values.assertValue(target.type, "Sigma")

  return Values.TypedNeutral(
    applyClosure(target.type.cdrTypeClosure, doCar(target)),
    Neutrals.Cdr(target.neutral, target.type),
  )
}
