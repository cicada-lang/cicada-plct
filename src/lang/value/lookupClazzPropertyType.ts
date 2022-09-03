import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import * as Values from "../value"
import { applyClosure, assertTypesInCtx, Value } from "../value"

export function lookupClazzPropertyType(
  ctx: Ctx,
  name: string,
  core: Cores.Objekt,
  clazz: Values.Clazz
): Value | undefined {
  if (clazz.kind === "ClazzNull") {
    return undefined
  } else {
    if (clazz.name === name) {
      return clazz.propertyType
    } else {
      let value = undefined
      if (clazz.kind === "ClazzFulfilled") {
        value = clazz.property
      } else {
        let propertyValue = core.properties[name]
        if (propertyValue !== undefined) {
          value = evaluate(ctxToEnv(ctx), core.properties[name])
        }
      }

      if (value === undefined) {
        return undefined
      } else {
        ctx = CtxCons(clazz.name, clazz.propertyType, ctx)
        const restClazz = applyClosure(clazz.restClosure, value)
        assertTypesInCtx(ctx, restClazz, [
          Values.ClazzNull,
          Values.ClazzCons,
          Values.ClazzFulfilled,
        ])
        return lookupClazzPropertyType(ctx, name, core, restClazz)
      }
    }
  }
}
