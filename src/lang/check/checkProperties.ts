import { check } from "../check"
import type { Core } from "../core"
import type { Ctx } from "../ctx"
import { CtxFulfilled, ctxToEnv } from "../ctx"
import { equivalent } from "../equivalent"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import type { Exp } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"

export function checkProperties(
  mod: Mod,
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
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
