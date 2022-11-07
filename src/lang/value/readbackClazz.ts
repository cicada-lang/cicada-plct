import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { assertClazzInCtx, readback, readbackType } from "../value"

export function readbackClazz(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
): Cores.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull()
    }

    case "ClazzCons": {
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, clazz.name)
      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(freshName))
      const restValue = applyClosure(clazz.restClosure, v)
      assertClazzInCtx(ctx, restValue)
      ctx = CtxCons(freshName, clazz.propertyType, ctx)
      const restCore = readbackClazz(mod, ctx, restValue)
      return Cores.ClazzCons(
        clazz.name,
        freshName,
        readbackType(mod, ctx, clazz.propertyType),
        restCore,
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        clazz.name,
        readbackType(mod, ctx, clazz.propertyType),
        readback(mod, ctx, clazz.propertyType, clazz.property),
        readbackClazz(mod, ctx, clazz.rest),
      )
    }
  }
}
