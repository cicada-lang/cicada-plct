import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames, ctxToEnv } from "../ctx"
import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { readbackType, Value } from "../value"

export function deepWalk(solution: Solution, ctx: Ctx, value: Value): Value {
  value = solution.walk(value)

  switch (value.kind) {
    case "TypedNeutral": {
      // TODO Maybe blocked can be eliminated now!
      return value
    }

    case "Type": {
      return value
    }

    case "Pi": {
      // TODO
      return value
    }

    case "ImplicitPi": {
      // TODO
      return value
    }

    case "Fn": {
      return value
    }

    case "ImplicitFn": {
      // TODO
      return value
    }

    case "Sigma": {
      const type = value
      const name = type.cdrTypeClosure.name
      const freshName = freshen(ctxNames(ctx), name)
      const variable = Neutrals.Var(freshName)
      const carType = deepWalk(solution, ctx, type.carType)
      const typedNeutral = Values.TypedNeutral(carType, variable)
      let cdrType = applyClosure(type.cdrTypeClosure, typedNeutral)
      cdrType = deepWalk(solution, ctx, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(ctx, cdrType)
      return Values.Sigma(
        carType,
        Closure(ctxToEnv(ctx), freshName, cdrTypeCore),
      )
    }

    case "Cons": {
      // TODO
      return value
    }

    case "String": {
      return value
    }

    case "Quote": {
      return value
    }

    case "Trivial": {
      return value
    }

    case "Sole": {
      return value
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      // TODO
      return value
    }

    case "Objekt": {
      // TODO
      return value
    }
  }
}
