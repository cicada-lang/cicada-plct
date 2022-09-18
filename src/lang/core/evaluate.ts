import * as Actions from "../actions"
import { Closure } from "../closure"
import { Core } from "../core"
import { Env, EnvCons, lookupValueInEnv } from "../env"
import { EvaluationError } from "../errors"
import { deepWalk, Solution } from "../solution"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function evaluate(solution: Solution, env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      let value = lookupValueInEnv(env, core.name)

      if (value === undefined) {
        value = solution.lookupValue(core.name)
        if (value !== undefined) {
          value = deepWalk(solution, value)
        }
      }

      if (value === undefined) {
        throw new EvaluationError(`Undefined name: ${core.name}`)
      }

      return value
    }

    case "Pi": {
      return Values.Pi(
        evaluate(solution, env, core.argType),
        Closure(solution, env, core.name, core.retType),
      )
    }

    case "ImplicitPi": {
      return Values.ImplicitPi(
        evaluate(solution, env, core.argType),
        Closure(solution, env, core.name, core.retType),
      )
    }

    case "Fn": {
      return Values.Fn(Closure(solution, env, core.name, core.ret))
    }

    case "ImplicitFn": {
      return Values.ImplicitFn(Closure(solution, env, core.name, core.ret))
    }

    case "Ap":
    case "ImplicitAp": {
      return Actions.doAp(
        evaluate(solution, env, core.target),
        evaluate(solution, env, core.arg),
      )
    }

    case "Sigma": {
      return Values.Sigma(
        evaluate(solution, env, core.carType),
        Closure(solution, env, core.name, core.cdrType),
      )
    }

    case "Cons": {
      return Values.Cons(
        evaluate(solution, env, core.car),
        evaluate(solution, env, core.cdr),
      )
    }

    case "Car": {
      return Actions.doCar(evaluate(solution, env, core.target))
    }

    case "Cdr": {
      return Actions.doCdr(evaluate(solution, env, core.target))
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
        evaluate(solution, env, core.propertyType),
        Closure(solution, env, core.localName, core.rest),
      )
    }

    case "ClazzFulfilled": {
      const propertyType = evaluate(solution, env, core.propertyType)
      const property = evaluate(solution, env, core.property)
      const rest = evaluate(
        solution,
        EnvCons(core.name, property, env),
        core.rest,
      )

      assertClazz(rest)

      return Values.ClazzFulfilled(core.name, propertyType, property, rest)
    }

    case "Objekt": {
      const properties = Object.fromEntries(
        Object.entries(core.properties).map(([name, core]) => [
          name,
          evaluate(solution, env, core),
        ]),
      )

      return Values.Objekt(properties)
    }

    case "Dot": {
      return Actions.doDot(evaluate(solution, env, core.target), core.name)
    }

    // default: {
    //   throw new EvaluationError(
    //     `evaluate is not implemented for core: ${core.kind}`,
    //   )
    // }
  }
}
