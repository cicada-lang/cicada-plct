import * as Actions from "../actions"
import { Core } from "../core"
import { Env, lookupEnvValue } from "../env"
import { EvaluationError } from "../errors"
import * as Values from "../value"
import { Closure, Value } from "../value"

export function evaluate(env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      const value = lookupEnvValue(env, core.name)
      if (value === undefined) {
        throw new EvaluationError(`Undefined name: ${name}`)
      }

      return value
    }

    case "Pi": {
      return Values.Pi(
        evaluate(env, core.argType),
        Closure(env, core.name, core.retType)
      )
    }

    case "Fn": {
      return Values.Fn(Closure(env, core.name, core.ret))
    }

    case "Ap": {
      return Actions.doAp(evaluate(env, core.target), evaluate(env, core.arg))
    }

    case "Sigma": {
      return Values.Sigma(
        evaluate(env, core.carType),
        Closure(env, core.name, core.cdrType)
      )
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
        Closure(env, core.localName, core.rest)
      )
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        core.name,
        evaluate(env, core.propertyType),
        evaluate(env, core.property),
        Closure(env, core.localName, core.rest)
      )
    }

    default: {
      throw new EvaluationError(
        `evaluate is not implemented for core: ${core.kind}`
      )
    }
  }
}
