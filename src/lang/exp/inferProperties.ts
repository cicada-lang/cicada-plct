import { applyClosure } from "../closure"
import { Core, evaluate } from "../core"
import { Ctx, CtxFulfilled } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"
import { assertClazzInCtx, conversion } from "../value"

export function inferProperties(
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
      const property = properties[clazz.name]
      if (property === undefined) {
        // TODO improve error report
        throw new Errors.ElaborationError(`missing property: ${clazz.name}`)
      }

      const propertyCore = Exps.check(mod, ctx, property, clazz.propertyType)
      const propertyValue = evaluate(mod.ctxToEnv(ctx), propertyCore)
      const rest = applyClosure(clazz.restClosure, propertyValue)

      assertClazzInCtx(ctx, rest)

      ctx = CtxFulfilled(clazz.name, clazz.propertyType, propertyValue, ctx)

      return {
        [clazz.name]: propertyCore,
        ...inferProperties(mod, ctx, properties, rest),
      }
    }

    case "ClazzFulfilled": {
      const property = properties[clazz.name]
      if (property !== undefined) {
        const propertyCore = Exps.check(mod, ctx, property, clazz.propertyType)
        const propertyValue = evaluate(mod.ctxToEnv(ctx), propertyCore)

        conversion(mod, ctx, clazz.propertyType, propertyValue, clazz.property)
      }

      const propertyCore = Values.readback(mod, ctx, clazz.propertyType, clazz.property)

      ctx = CtxFulfilled(clazz.name, clazz.propertyType, clazz.property, ctx)

      return {
        [clazz.name]: propertyCore,
        ...inferProperties(mod, ctx, properties, clazz.rest),
      }
    }
  }
}
