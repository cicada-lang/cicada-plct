import { applyClosure, Closure } from "../closure"
import * as Errors from "../errors"
import * as Values from "../value"
import { Value } from "../value"

export function clazzClosureApply(closure: Closure, arg: Value): Values.Clazz {
  const value = applyClosure(closure, arg)
  if (!Values.isClazz(value)) {
    throw new Errors.EvaluationError(
      [
        `[clazzClosureApply] expect value to be a Clazz`,
        `  value.kind: ${value.kind}`,
      ].join("\n"),
    )
  }

  return value
}
