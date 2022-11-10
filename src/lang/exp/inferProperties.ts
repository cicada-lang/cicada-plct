import { applyClosure } from "../closure"
import { Core, evaluate } from "../core"
import { Ctx, CtxFulfilled } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"
import { conversion } from "../value"

export function inferProperties(
  mod: Mod,
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz,
): { properties: Record<string, Core>; clazz: Values.Clazz } {
  switch (clazz.kind) {
    case "ClazzNull": {
      return { properties: {}, clazz: Values.ClazzNull() }
    }

    case "ClazzCons": {
      const propertyExp = properties[clazz.name]
      if (propertyExp === undefined) {
        throw new Errors.ElaborationError(`missing property: ${clazz.name}`, {})
      }

      const propertyCore = Exps.check(mod, ctx, propertyExp, clazz.propertyType)
      const propertyValue = evaluate(mod.ctxToEnv(ctx), propertyCore)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      Values.assertClazzInCtx(mod, ctx, rest)
      ctx = CtxFulfilled(clazz.name, clazz.propertyType, propertyValue, ctx)

      const inferred = inferProperties(mod, ctx, properties, rest)

      return {
        properties: { [clazz.name]: propertyCore, ...inferred.properties },
        clazz: Values.ClazzFulfilled(
          clazz.name,
          clazz.propertyType,
          propertyValue,
          inferred.clazz,
        ),
      }
    }

    case "ClazzFulfilled": {
      const propertyExp = properties[clazz.name]
      if (propertyExp !== undefined) {
        const propertyCore = Exps.check(
          mod,
          ctx,
          propertyExp,
          clazz.propertyType,
        )
        const propertyValue = evaluate(mod.ctxToEnv(ctx), propertyCore)
        conversion(mod, ctx, clazz.propertyType, propertyValue, clazz.property)
      }

      const propertyCore = Values.readback(
        mod,
        ctx,
        clazz.propertyType,
        clazz.property,
      )
      ctx = CtxFulfilled(clazz.name, clazz.propertyType, clazz.property, ctx)

      const inferred = inferProperties(mod, ctx, properties, clazz.rest)

      return {
        properties: { [clazz.name]: propertyCore, ...inferred.properties },
        clazz: Values.ClazzFulfilled(
          clazz.name,
          clazz.propertyType,
          clazz.property,
          inferred.clazz,
        ),
      }
    }
  }
}
