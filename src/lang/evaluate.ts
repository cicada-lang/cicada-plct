import { Closure } from "./Closure"
import { Core } from "./Core"
import { Env, lookupEnvValue } from "./Env"
import { EvaluationError } from "./errors/EvaluationError"
import { globals } from "./globals"
import * as Values from "./Value"
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

    case "Pi": {
      const argType = evaluate(env, core.argType)
      const retTypeClosure = Closure(env, core.name, core.retType)
      return Values.Pi(argType, retTypeClosure)
    }

    case "Fn": {
      const retClosure = Closure(env, core.name, core.ret)
      return Values.Fn(retClosure)
    }

    default: {
      throw new Error(`evaluate is not implemented for core: ${core.kind}`)
    }
  }
}
