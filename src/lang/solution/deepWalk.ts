import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { readbackType, Value } from "../value"

/**

   # `deepWalk` need to do partial evaluation on `Fn`

   `deepWalk` takes `type` as argument,
   NOT because of it is doing eta-expansion,
   but because of it need to do partial evaluation of `Fn`,
   thus need `argType` to construct a `TypedNeutral`.

   another solution is to let `Values.Fn` and `Cores.Fn` always have `argType`.

**/

export function deepWalk(mod: Mod, ctx: Ctx, type: Value, value: Value): Value {
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
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalk(mod, ctx, type, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(value.retTypeClosure, typedNeutral)
      retType = deepWalk(mod, ctx, type, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.Pi(argType, Closure(env, freshName, retTypeCore))
    }

    case "PiImplicit": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalk(mod, ctx, type, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(value.retTypeClosure, typedNeutral)
      retType = deepWalk(mod, ctx, type, retType)
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
      const name = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const carType = deepWalk(mod, ctx, type, value.carType)
      const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let cdrType = applyClosure(value.cdrTypeClosure, typedNeutral)
      cdrType = deepWalk(mod, ctx, type, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
      return Values.Sigma(carType, Closure(env, freshName, cdrTypeCore))
    }

    case "Cons": {
      return Values.Cons(
        deepWalk(mod, ctx, type, value.car),
        deepWalk(mod, ctx, type, value.car),
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

    case "ClazzNull": {
      return value
    }

    case "ClazzCons": {
      // TODO
      return value
    }

    case "ClazzFulfilled": {
      // TODO
      return value
    }

    case "Objekt": {
      return Values.Objekt(
        Object.fromEntries(
          Object.entries(value.properties).map(([name, property]) => [
            name,
            deepWalk(mod, ctx, type, property),
          ]),
        ),
      )
    }
  }
}
