import * as Actions from "../actions"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import * as Values from "../value"
import { assertClazzInCtx, readback, Value } from "../value"

export function readbackProperties(
  ctx: Ctx,
  type: Values.Clazz,
  value: Value
): Record<string, Cores.Core> {
  switch (type.kind) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      const propertyValue = Actions.doDot(value, type.name)
      const rest = Values.applyClosure(type.restClosure, propertyValue)
      assertClazzInCtx(ctx, rest)
      const propertyCore = readback(ctx, type.propertyType, propertyValue)
      return {
        [type.name]: propertyCore,
        ...readbackProperties(ctx, rest, value),
      }
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, type.name)
      const rest = type.rest
      const propertyCore = readback(ctx, type.propertyType, propertyValue)
      return {
        [type.name]: propertyCore,
        ...readbackProperties(ctx, rest, value),
      }
    }
  }
}
