import { Core } from "./Core"
import { Env, lookupEnvValue } from "./Env"
import { EvaluationError } from "./errors/EvaluationError"
import { globals } from "./globals"
import { Value } from "./Value"

export function evaluate(env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      const foundValue = lookupEnvValue(env, core.name)
      if (foundValue === undefined) {
        throw new EvaluationError(`Undefined name: ${name}`)
      }

      return foundValue
    }

    case "Global": {
      const globalValue = globals.lookupValue(core.name)
      if (globalValue === undefined) {
        throw new EvaluationError(`Undefined global name: ${name}`)
      }

      return globalValue
    }

    default: {
      throw new Error("TODO")
    }
  }
}
