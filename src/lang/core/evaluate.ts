import * as Actions from "../actions"
import { Env, lookupEnvValue } from "../env"
import { EvaluationError } from "../errors"
import * as Values from "../value"
import { Closure, Value } from "../value"
import { Core } from "./Core"

export function evaluate(env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      const foundValue = lookupEnvValue(env, core.name)
      if (foundValue === undefined) {
        throw new EvaluationError(`Undefined name: ${name}`)
      }

      return foundValue
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

    case "Ap": {
      return Actions.doAp(evaluate(env, core.target), evaluate(env, core.arg))
    }

    case "Sigma": {
      const argType = evaluate(env, core.carType)
      const retTypeClosure = Closure(env, core.name, core.cdrType)
      return Values.Sigma(argType, retTypeClosure)
    }

    case "Cons": {
      return Values.Cons(evaluate(env, core.car), evaluate(env, core.cdr))
    }

    case "Car": {
      return Actions.doCar(evaluate(env, core.target))
    }

    case "Cdr": {
      return Actions.doCdr(evaluate(env, core.target))
    }

    case "Quote": {
      return Values.Quote(core.literal)
    }

    case "ClazzNull": {
      return Values.ClazzNull()
    }

    case "ClazzCons": {
      return Values.ClazzCons(
        core.name,
        evaluate(env, core.propertyType),
        Closure(env, core.name, core.rest)
      )
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        core.name,
        evaluate(env, core.propertyType),
        evaluate(env, core.property),
        Closure(env, core.name, core.rest)
      )
    }

    default: {
      throw new EvaluationError(
        `evaluate is not implemented for core: ${core.kind}`
      )
    }
  }
}
