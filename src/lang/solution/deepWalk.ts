import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { readbackType, Value } from "../value"

export function deepWalk(mod: Mod, ctx: Ctx, value: Value): Value {
  value = mod.solution.walk(value)

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
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalk(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(type.retTypeClosure, typedNeutral)
      retType = deepWalk(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.Pi(argType, Closure(env, freshName, retTypeCore))
    }

    case "PiImplicit": {
      const type = value
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalk(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(type.retTypeClosure, typedNeutral)
      retType = deepWalk(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.PiImplicit(argType, Closure(env, freshName, retTypeCore))
    }

    case "Fn": {
      // TODO
      return value
    }

    case "FnImplicit": {
      // TODO
      return value
    }

    case "Sigma": {
      const type = value
      const name = type.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const carType = deepWalk(mod, ctx, type.carType)
      const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let cdrType = applyClosure(type.cdrTypeClosure, typedNeutral)
      cdrType = deepWalk(mod, ctx, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
      return Values.Sigma(carType, Closure(env, freshName, cdrTypeCore))
    }

    case "Cons": {
      return Values.Cons(
        deepWalk(mod, ctx, value.car),
        deepWalk(mod, ctx, value.car),
      )
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
      return Values.Objekt(
        Object.fromEntries(
          Object.entries(value.properties).map(([name, property]) => [
            name,
            deepWalk(mod, ctx, property),
          ]),
        ),
      )
    }
  }
}
