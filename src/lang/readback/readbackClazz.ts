import * as Cores from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { readback, readbackType } from "../readback"
import { solutionNames } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"

export function readbackClazz(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
): Cores.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull(clazz.name)
    }

    case "ClazzCons": {
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, clazz.propertyName)
      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(freshName))
      const rest = Values.clazzClosureApply(clazz.restClosure, v)
      ctx = CtxCons(freshName, clazz.propertyType, ctx)
      const restCore = readbackClazz(mod, ctx, rest)
      return Cores.ClazzCons(
        clazz.propertyName,
        freshName,
        readbackType(mod, ctx, clazz.propertyType),
        restCore,
        clazz.name,
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        clazz.propertyName,
        readbackType(mod, ctx, clazz.propertyType),
        readback(mod, ctx, clazz.propertyType, clazz.property),
        readbackClazz(mod, ctx, clazz.rest),
        clazz.name,
      )
    }
  }
}
