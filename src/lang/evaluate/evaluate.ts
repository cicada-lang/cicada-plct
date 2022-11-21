import * as Actions from "../actions"
import { ClosureSimple } from "../closure"
import type { Core } from "../core"
import type { Env } from "../env"
import { EnvCons, envLookupValue } from "../env"
import * as Errors from "../errors"
import type { Value } from "../value"
import * as Values from "../value"

export function evaluate(env: Env, core: Core): Value {
  switch (core["@kind"]) {
    case "Var": {
      const value = envLookupValue(env, core.name)
      if (value === undefined) {
        throw new Errors.EvaluationError(
          `[evaluate] undefined variable name: ${core.name}`,
        )
      }

      return value
    }

    case "MetaVar": {
      const value = envLookupValue(env, core.name)
      if (value === undefined) {
        throw new Errors.EvaluationError(
          `[evaluate] undefined meta variable name: ${core.name}`,
        )
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
      return Values.ClazzNull(core.name)
    }

    case "ClazzCons": {
      return Values.ClazzCons(
        core.propertyName,
        evaluate(env, core.propertyType),
        ClosureSimple(env, core.localName, core.rest),
        core.name,
      )
    }

    case "ClazzFulfilled": {
      const propertyType = evaluate(env, core.propertyType)
      const property = evaluate(env, core.property)
      env = EnvCons(core.propertyName, property, env)
      const rest = evaluate(env, core.rest)
      if (!Values.isClazz(rest)) {
        throw new Errors.EvaluationError(
          [
            `[evaluate] during ClazzFulfilled, expect the rest to be Clazz`,
            `  rest["@kind"]: ${rest["@kind"]}`,
          ].join("\n"),
        )
      }

      return Values.ClazzFulfilled(
        core.propertyName,
        propertyType,
        property,
        rest,
        core.name,
      )
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
  }
}
