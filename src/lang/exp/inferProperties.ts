import { applyClosure } from "../closure"
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

      const propertyCore = Exps.check(ctx, property, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      const rest = applyClosure(clazz.restClosure, propertyValue)

      assertClazzInCtx(ctx, rest)

      ctx = CtxFulfilled(clazz.name, clazz.propertyType, propertyValue, ctx)

      return {
        [clazz.name]: propertyCore,
        ...inferProperties(ctx, properties, rest),
      }
    }

    case "ClazzFulfilled": {
      const property = properties[clazz.name]
      if (property !== undefined) {
        const propertyCore = Exps.check(ctx, property, clazz.propertyType)
        const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)

        conversion(ctx, clazz.propertyType, propertyValue, clazz.property)
      }

      const propertyCore = Values.readback(
        ctx,
        clazz.propertyType,
        clazz.property,
      )

      ctx = CtxFulfilled(clazz.name, clazz.propertyType, clazz.property, ctx)

      return {
        [clazz.name]: propertyCore,
        ...inferProperties(ctx, properties, clazz.rest),
      }
    }
  }
}
