import { closureApply } from "../closure"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { Value } from "../value"
import { doCar } from "./doCar"

export function doCdr(target: Value): Value {
  if (target.kind === "Cons") {
    return target.cdr
  }

  Values.assertValue(target, "TypedNeutral")

  if (target.type.kind !== "Sigma") {
    throw new Errors.EvaluationError(
      [
        `[doCdr] When target is a TypedNeutral, expect target.type to be Sigma`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    closureApply(target.type.cdrTypeClosure, doCar(target)),
    Neutrals.Cdr(target.neutral, target.type),
  )
}
