import { check, checkType } from "../check"
import * as Cores from "../core"
import { Ctx, CtxCons, CtxFulfilled, ctxToEnv } from "../ctx"
import { evaluate } from "../evaluate"
import * as Exps from "../exp"
import { Mod } from "../mod"

export function checkClazz(mod: Mod, ctx: Ctx, exp: Exps.Clazz): Cores.Clazz {
  switch (exp.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull()
    }

    case "ClazzCons": {
      const propertyTypeCore = checkType(mod, ctx, exp.propertyType)
      const propertyType = evaluate(ctxToEnv(ctx), propertyTypeCore)
      ctx = CtxCons(exp.localName, propertyType, ctx)
      const restCore = checkClazz(mod, ctx, exp.rest)
      return Cores.ClazzCons(
        exp.name,
        exp.localName,
        propertyTypeCore,
        restCore,
      )
    }

    case "ClazzFulfilled": {
      const propertyTypeCore = checkType(mod, ctx, exp.propertyType)
      const propertyType = evaluate(ctxToEnv(ctx), propertyTypeCore)
      const propertyCore = check(mod, ctx, exp.property, propertyType)
      const property = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxFulfilled(exp.localName, propertyType, property, ctx)
      const restCore = checkClazz(mod, ctx, exp.rest)
      return Cores.ClazzFulfilled(
        exp.name,
        propertyTypeCore,
        propertyCore,
        restCore,
      )
    }
  }
}
