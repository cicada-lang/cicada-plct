import * as Actions from "../actions"
import { ClosureSimple } from "../closure"
import { Core } from "../core"
import { Env, EnvCons, lookupValueInEnv } from "../env"
import * as Errors from "../errors"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function evaluate(env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      const value = lookupValueInEnv(env, core.name)
      if (value === undefined) {
        throw new Errors.EvaluationError(`Undefined name: ${core.name}`)
      }

      return value
    }

    case "Pi": {
      return Values.Pi(
        evaluate(env, core.argType),
        ClosureSimple(env, core.name, core.retType),
      )
    }

    case "PiImplicit": {
      return Values.PiImplicit(
        evaluate(env, core.argType),
        ClosureSimple(env, core.name, core.retType),
      )
    }

    case "Fn": {
      return Values.Fn(ClosureSimple(env, core.name, core.ret))
    }

    case "FnImplicit": {
      return Values.FnImplicit(ClosureSimple(env, core.name, core.ret))
    }

    case "Ap": {
      return Actions.doAp(evaluate(env, core.target), evaluate(env, core.arg))
    }

    case "ApImplicit": {
      return Actions.doApImplicit(
        evaluate(env, core.target),
        evaluate(env, core.arg),
      )
    }

    case "Sigma": {
      return Values.Sigma(
        evaluate(env, core.carType),
        ClosureSimple(env, core.name, core.cdrType),
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
      return Values.Quote(core.data)
    }

    case "ClazzNull": {
      return Values.ClazzNull()
    }

    case "ClazzCons": {
      return Values.ClazzCons(
        core.name,
        evaluate(env, core.propertyType),
        ClosureSimple(env, core.localName, core.rest),
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
        Object.entries(core.properties).map(([name, core]) => [
          name,
          evaluate(env, core),
        ]),
      )

      return Values.Objekt(properties)
    }

    case "Dot": {
      return Actions.doDot(evaluate(env, core.target), core.name)
    }

    case "Replace": {
      return Actions.doReplace(
        evaluate(env, core.target),
        evaluate(env, core.motive),
        evaluate(env, core.base),
      )
    }

    // default: {
    //   throw new Errors.EvaluationError(
    //     `evaluate is not implemented for core: ${core.kind}`,
    //   )
    // }
  }
}
