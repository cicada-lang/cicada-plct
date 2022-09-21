import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, CtxCons, CtxFulfilled, ctxToEnv } from "../ctx"
import * as Exps from "../exp"
import { check, checkType } from "../exp"
import { Mod } from "../mod"

export function checkClazz(mod: Mod, ctx: Ctx, exp: Exps.Clazz): Cores.Clazz {
  switch (exp.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull()
    }

    case "ClazzCons": {
      const propertyTypeCore = checkType(mod, ctx, exp.propertyType)
      const propertyTypeValue = evaluate(ctxToEnv(ctx), propertyTypeCore)
      ctx = CtxCons(exp.name, propertyTypeValue, ctx)
      const restCore = checkClazz(mod, ctx, exp.rest)
      return Cores.ClazzCons(exp.name, exp.name, propertyTypeCore, restCore)
    }

    case "ClazzFulfilled": {
      const propertyTypeCore = checkType(mod, ctx, exp.propertyType)
      const propertyTypeValue = evaluate(ctxToEnv(ctx), propertyTypeCore)
      const propertyCore = check(mod, ctx, exp.property, propertyTypeValue)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxFulfilled(exp.name, propertyTypeValue, propertyValue, ctx)
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
