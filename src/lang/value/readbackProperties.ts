import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import * as Values from "../value"
import { assertClazzInCtx, readback, Value } from "../value"

export function readbackProperties(
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
      assertClazzInCtx(ctx, rest)
      const propertyCore = readback(ctx, clazz.propertyType, propertyValue)
      return {
        [clazz.name]: propertyCore,
        ...readbackProperties(ctx, rest, value),
      }
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, clazz.name)
      const propertyCore = readback(ctx, clazz.propertyType, propertyValue)
      return {
        [clazz.name]: propertyCore,
        ...readbackProperties(ctx, clazz.rest, value),
      }
    }
  }
}
