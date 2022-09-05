import { Core, evaluate } from "../core"
import { Ctx, CtxFulfilled, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import * as Values from "../value"
import { assertClazzInCtx, conversion } from "../value"

export function inferProperties(
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      const property = properties[clazz.name]
      if (property === undefined) {
        // TODO improve error report
        throw new ElaborationError(`missing property: ${clazz.name}`)
      }

      const propertyType = clazz.propertyType
      const propertyCore = Exps.check(ctx, property, propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      const rest = Values.applyClosure(clazz.restClosure, propertyValue)
      assertClazzInCtx(ctx, rest)

      ctx = CtxFulfilled(clazz.name, propertyType, propertyValue, ctx)

      return {
        [clazz.name]: propertyCore,
        ...inferProperties(ctx, properties, rest),
      }
    }

    case "ClazzFulfilled": {
      const clazzProperty = clazz.property

      const expProperty = properties[clazz.name]
      if (expProperty !== undefined) {
        const expPropertyType = clazz.propertyType
        const expPropertyCore = Exps.check(ctx, expProperty, expPropertyType)
        const expPropertyValue = evaluate(ctxToEnv(ctx), expPropertyCore)

        conversion(ctx, expPropertyType, expPropertyValue, clazzProperty)
      }

      const propertyCore = Values.readback(
        ctx,
        clazz.propertyType,
        clazzProperty,
      )

      ctx = CtxFulfilled(clazz.name, clazz.propertyType, clazzProperty, ctx)

      return {
        [clazz.name]: propertyCore,
        ...inferProperties(ctx, properties, clazz.rest),
      }
    }
  }
}
