import { applyClosure } from "../../closure"
import { Ctx, CtxCons, CtxFulfilled, ctxNames } from "../../ctx"
import { Mod } from "../../mod"
import * as Neutrals from "../../neutral"
import { freshen } from "../../utils/freshen"
import * as Values from "../../value"
import { assertClazz } from "../../value"

export function clazzExtendCtx(mod: Mod, ctx: Ctx, clazz: Values.Clazz): Ctx {
  switch (clazz.kind) {
    case "ClazzNull": {
      return ctx
    }

    case "ClazzCons": {
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, clazz.name)
      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(freshName))
      const rest = applyClosure(clazz.restClosure, v)
      assertClazz(rest)
      ctx = CtxCons(clazz.name, clazz.propertyType, ctx)
      return clazzExtendCtx(mod, ctx, rest)
    }

    case "ClazzFulfilled": {
      ctx = CtxFulfilled(clazz.name, clazz.propertyType, clazz.property, ctx)
      return clazzExtendCtx(mod, ctx, clazz.rest)
    }
  }
}
