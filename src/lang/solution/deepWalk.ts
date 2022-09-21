import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
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
      const type = value
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const argType = deepWalk(solution, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, variable)
      let retType = applyClosure(type.retTypeClosure, typedNeutral)
      solution.bind(freshName, typedNeutral)
      retType = deepWalk(solution, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(ctx, retType)
      const env = solution.enrichCtx(ctx)
      return Values.Pi(argType, Closure(env, freshName, retTypeCore))
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
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const carType = deepWalk(solution, ctx, type.carType)
      const typedNeutral = Values.TypedNeutral(carType, variable)
      let cdrType = applyClosure(type.cdrTypeClosure, typedNeutral)
      solution.bind(freshName, typedNeutral)
      cdrType = deepWalk(solution, ctx, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(ctx, cdrType)
      const env = solution.enrichCtx(ctx)
      return Values.Sigma(carType, Closure(env, freshName, cdrTypeCore))
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
