import type { Closure } from "../closure/index.js"
import { closureApply } from "../closure/index.js"
import * as Errors from "../errors/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function clazzClosureApply(closure: Closure, arg: Value): Values.Clazz {
  const value = closureApply(closure, arg)
  if (!Values.isClazz(value)) {
    throw new Errors.EvaluationError(
      [
        `[clazzClosureApply] expect value to be a Clazz`,
        `  value["@kind"]: ${value["@kind"]}`,
      ].join("\n"),
    )
  }

  return value
}
