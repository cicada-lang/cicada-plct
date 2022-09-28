import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
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
      const patternVar = mod.solution.createPatternVar(freshName, argType)
      let retType = applyClosure(type.retTypeClosure, patternVar)
      mod.solution.bind(freshName, patternVar)
      retType = deepWalk(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.Pi(argType, Closure(env, freshName, retTypeCore))
    }

    case "PiImplicit": {
      // TODO
      return value
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
      const patternVar = mod.solution.createPatternVar(freshName, carType)
      let cdrType = applyClosure(type.cdrTypeClosure, patternVar)
      mod.solution.bind(freshName, patternVar)
      cdrType = deepWalk(mod, ctx, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
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
