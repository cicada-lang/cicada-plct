import { closureApply } from "../closure/index.js"
import type { Core } from "../core/index.js"
import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxCons, ctxNames } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import { readback, readbackClazz, readbackNeutral } from "../readback/index.js"
import { solutionAdvanceValue, solutionNames } from "../solution/index.js"
import { freshen } from "../utils/freshen.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function readbackType(mod: Mod, ctx: Ctx, type: Value): Core {
  type = solutionAdvanceValue(mod, type)

  switch (type["@kind"]) {
    case "TypedNeutral": {
      /**
         The `type` in `TypedNeutral` are not used.
      **/
      return readbackNeutral(mod, ctx, type.neutral)
    }

    case "Type": {
      return Cores.Var("Type")
    }

    case "String": {
      return Cores.Var("String")
    }

    case "Trivial": {
      return Cores.Var("Trivial")
    }

    case "Pi": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const argTypeCore = readbackType(mod, ctx, type.argType)
      const retTypeValue = closureApply(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retTypeValue)
      return Cores.Pi(freshName, argTypeCore, retTypeCore)
    }

    case "PiImplicit": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const argTypeCore = readbackType(mod, ctx, type.argType)
      const retTypeValue = closureApply(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retTypeValue)
      return Cores.PiImplicit(freshName, argTypeCore, retTypeCore)
    }

    case "Sigma": {
      const name = type.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.carType, Neutrals.Var(freshName))
      const carTypeCore = readbackType(mod, ctx, type.carType)
      const cdrTypeValue = closureApply(type.cdrTypeClosure, v)
      ctx = CtxCons(freshName, type.carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrTypeValue)
      return Cores.Sigma(freshName, carTypeCore, cdrTypeCore)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return readbackClazz(mod, ctx, type)
    }

    case "Equal": {
      return Cores.Ap(
        Cores.Ap(
          Cores.Ap(Cores.Var("Equal"), readbackType(mod, ctx, type.type)),
          readback(mod, ctx, type.type, type.from),
        ),
        readback(mod, ctx, type.type, type.to),
      )
    }

    default: {
      throw new Errors.ReadbackError(
        `readbackType is not implemented for type: ${type["@kind"]}`,
      )
    }
  }
}
