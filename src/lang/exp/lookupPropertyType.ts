import { evaluate, Objekt } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import {
  applyClosure,
  assertTypesInCtx,
  Clazz,
  ClazzCons,
  ClazzFulfilled,
  ClazzNull,
  Value,
} from "../value"

export function lookupPropertyType(
  ctx: Ctx,
  name: string,
  core: Objekt,
  clazz: Clazz
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
        assertTypesInCtx(ctx, restClazz, [ClazzNull, ClazzCons, ClazzFulfilled])
        return lookupPropertyType(ctx, name, core, restClazz)
      }
    }
  }
}
