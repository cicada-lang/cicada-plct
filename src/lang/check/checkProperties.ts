import { check } from "../check/index.js"
import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxFulfilled, ctxToEnv } from "../ctx/index.js"
import { equivalent } from "../equivalent/index.js"
import * as Errors from "../errors/index.js"
import { evaluate } from "../evaluate/index.js"
import type { Exp } from "../exp/index.js"
import type { Mod } from "../mod/index.js"
import * as Values from "../value/index.js"

export function checkProperties(
  mod: Mod,
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      const property = properties[clazz.propertyName]
      if (property === undefined) {
        throw new Errors.ElaborationError(
          `[checkProperties] missing property: ${clazz.propertyName}`,
          {},
        )
      }

      const propertyCore = check(mod, ctx, property, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        propertyValue,
        ctx,
      )
      const rest = Values.clazzClosureApply(clazz.restClosure, propertyValue)
      return {
        [clazz.propertyName]: propertyCore,
        ...checkProperties(mod, ctx, properties, rest),
      }
    }

    case "ClazzFulfilled": {
      const property = properties[clazz.propertyName]
      if (property === undefined) {
        throw new Errors.ElaborationError(
          `[checkProperties] missing property: ${clazz.propertyName}`,
          {},
        )
      }

      const propertyCore = check(mod, ctx, property, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      equivalent(mod, ctx, clazz.propertyType, propertyValue, clazz.property)
      ctx = CtxFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        propertyValue,
        ctx,
      )
      return {
        [clazz.propertyName]: propertyCore,
        ...checkProperties(mod, ctx, properties, clazz.rest),
      }
    }
  }
}
