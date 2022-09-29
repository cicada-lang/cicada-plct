import * as Actions from "../actions"
import { Closure } from "../closure"
import { Core } from "../core"
import { Env, EnvCons, lookupValueInEnv } from "../env"
import { EvaluationError } from "../errors"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function evaluate(env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      const value = lookupValueInEnv(env, core.name)

      if (value === undefined) {
        throw new EvaluationError(`Undefined name: ${core.name}`)
      }

      return value
    }

    case "Pi": {
      return Values.Pi(evaluate(env, core.argType), Closure(env, core.name, core.retType))
    }

    case "PiImplicit": {
      return Values.PiImplicit(evaluate(env, core.argType), Closure(env, core.name, core.retType))
    }

    case "Fn": {
      return Values.Fn(Closure(env, core.name, core.ret))
    }

    case "FnImplicit": {
      return Values.FnImplicit(Closure(env, core.name, core.ret))
    }

    case "Ap":
    case "ApImplicit": {
      return Actions.doAp(evaluate(env, core.target), evaluate(env, core.arg))
    }

    case "Sigma": {
      return Values.Sigma(evaluate(env, core.carType), Closure(env, core.name, core.cdrType))
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
      return Values.Quote(core.data)
    }

    case "ClazzNull": {
      return Values.ClazzNull()
    }

    case "ClazzCons": {
      return Values.ClazzCons(
        core.name,
        evaluate(env, core.propertyType),
        Closure(env, core.localName, core.rest),
      )
    }

    case "ClazzFulfilled": {
      const propertyType = evaluate(env, core.propertyType)
      const property = evaluate(env, core.property)
      const rest = evaluate(EnvCons(core.name, property, env), core.rest)

      assertClazz(rest)

      return Values.ClazzFulfilled(core.name, propertyType, property, rest)
    }

    case "Objekt": {
      const properties = Object.fromEntries(
        Object.entries(core.properties).map(([name, core]) => [name, evaluate(env, core)]),
      )

      return Values.Objekt(properties)
    }

    case "Dot": {
      return Actions.doDot(evaluate(env, core.target), core.name)
    }

    // default: {
    //   throw new EvaluationError(
    //     `evaluate is not implemented for core: ${core.kind}`,
    //   )
    // }
  }
}
