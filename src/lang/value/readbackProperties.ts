import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import * as Values from "../value"
import { readback, Value } from "../value"

export function readbackProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  value: Value,
): Record<string, Cores.Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      const propertyValue = Actions.doDot(value, clazz.name)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      Values.assertClazzInCtx(ctx, rest)
      const propertyCore = readback(mod, ctx, clazz.propertyType, propertyValue)
      return {
        [clazz.name]: propertyCore,
        ...readbackProperties(mod, ctx, rest, value),
      }
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, clazz.name)
      const propertyCore = readback(mod, ctx, clazz.propertyType, propertyValue)
      return {
        [clazz.name]: propertyCore,
        ...readbackProperties(mod, ctx, clazz.rest, value),
      }
    }
  }
}
