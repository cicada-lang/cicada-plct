import { Ctx, CtxCons, CtxFulfilled, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { solutionNames } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"

export function clazzExtendCtx(mod: Mod, ctx: Ctx, clazz: Values.Clazz): Ctx {
  switch (clazz.kind) {
    case "ClazzNull": {
      return ctx
    }

    case "ClazzCons": {
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, clazz.propertyName)
      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(freshName))
      const rest = Values.clazzClosureApply(clazz.restClosure, v)
      ctx = CtxCons(clazz.propertyName, clazz.propertyType, ctx)
      return clazzExtendCtx(mod, ctx, rest)
    }

    case "ClazzFulfilled": {
      ctx = CtxFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        clazz.property,
        ctx,
      )
      return clazzExtendCtx(mod, ctx, clazz.rest)
    }
  }
}
