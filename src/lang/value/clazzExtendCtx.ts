import type { Ctx } from "../ctx/index.js"
import { CtxCons, CtxFulfilled, ctxNames } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import { solutionNames } from "../solution/index.js"
import { freshen } from "../utils/freshen.js"
import * as Values from "../value/index.js"

export function clazzExtendCtx(mod: Mod, ctx: Ctx, clazz: Values.Clazz): Ctx {
  switch (clazz["@kind"]) {
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
