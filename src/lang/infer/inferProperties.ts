import { check } from "../check"
import type { Core } from "../core"
import type { Ctx } from "../ctx"
import { CtxFulfilled, ctxToEnv } from "../ctx"
import { equivalent } from "../equivalent"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import type { Exp } from "../exp"
import type { Mod } from "../mod"
import { readback } from "../readback"
import * as Values from "../value"

export function inferProperties(
  mod: Mod,
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz,
): { properties: Record<string, Core>; clazz: Values.Clazz } {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      return { properties: {}, clazz: Values.ClazzNull(clazz.name) }
    }

    case "ClazzCons": {
      const propertyExp = properties[clazz.propertyName]
      if (propertyExp === undefined) {
        throw new Errors.ElaborationError(
          `missing property: ${clazz.propertyName}`,
          {},
        )
      }

      const propertyCore = check(mod, ctx, propertyExp, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      const rest = Values.clazzClosureApply(clazz.restClosure, propertyValue)
      ctx = CtxFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        propertyValue,
        ctx,
      )

      const inferred = inferProperties(mod, ctx, properties, rest)

      return {
        properties: {
          [clazz.propertyName]: propertyCore,
          ...inferred.properties,
        },
        clazz: Values.ClazzFulfilled(
          clazz.propertyName,
          clazz.propertyType,
          propertyValue,
          inferred.clazz,
          clazz.name,
        ),
      }
    }

    case "ClazzFulfilled": {
      const propertyExp = properties[clazz.propertyName]
      if (propertyExp !== undefined) {
        const propertyCore = check(mod, ctx, propertyExp, clazz.propertyType)
        const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
        equivalent(mod, ctx, clazz.propertyType, propertyValue, clazz.property)
      }

      const propertyCore = readback(
        mod,
        ctx,
        clazz.propertyType,
        clazz.property,
      )
      ctx = CtxFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        clazz.property,
        ctx,
      )

      const inferred = inferProperties(mod, ctx, properties, clazz.rest)

      return {
        properties: {
          [clazz.propertyName]: propertyCore,
          ...inferred.properties,
        },
        clazz: Values.ClazzFulfilled(
          clazz.propertyName,
          clazz.propertyType,
          clazz.property,
          inferred.clazz,
          clazz.name,
        ),
      }
    }
  }
}
