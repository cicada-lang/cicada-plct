import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxCons, ctxNames } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import { readback, readbackType } from "../readback/index.js"
import { solutionNames } from "../solution/index.js"
import { freshen } from "../utils/freshen.js"
import * as Values from "../value/index.js"

export function readbackClazz(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
): Cores.Clazz {
  switch (clazz["@kind"]) {
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
