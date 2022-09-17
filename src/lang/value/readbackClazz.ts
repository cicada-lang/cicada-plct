import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { assertClazzInCtx, readback, readbackType } from "../value"

export function readbackClazz(ctx: Ctx, clazz: Values.Clazz): Cores.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull()
    }

    case "ClazzCons": {
      const freshName = freshen(new Set(ctxNames(ctx)), clazz.name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(clazz.propertyType, variable)
      const restValue = applyClosure(clazz.restClosure, typedNeutral)
      assertClazzInCtx(ctx, restValue)
      ctx = CtxCons(freshName, clazz.propertyType, ctx)
      const restCore = readbackClazz(ctx, restValue)
      return Cores.ClazzCons(
        clazz.name,
        freshName,
        readbackType(ctx, clazz.propertyType),
        restCore,
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        clazz.name,
        readbackType(ctx, clazz.propertyType),
        readback(ctx, clazz.propertyType, clazz.property),
        readbackClazz(ctx, clazz.rest),
      )
    }
  }
}
