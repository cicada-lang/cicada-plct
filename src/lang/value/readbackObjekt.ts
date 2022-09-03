import * as Actions from "../actions"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import * as Values from "../value"
import { assertTypesInCtx, readback, Value } from "../value"

export function readbackObjekt(
  ctx: Ctx,
  type: Values.Clazz,
  value: Value
): Cores.Objekt {
  switch (type.kind) {
    case "ClazzNull": {
      return Cores.Objekt({})
    }

    case "ClazzCons": {
      const propertyValue = Actions.doDot(value, type.name)
      const rest = Values.applyClosure(type.restClosure, propertyValue)
      assertTypesInCtx(ctx, rest, [
        Values.ClazzNull,
        Values.ClazzCons,
        Values.ClazzFulfilled,
      ])

      const propertyCore = readback(ctx, type.propertyType, propertyValue)
      const restCore = readbackObjekt(ctx, rest, value)

      return Cores.Objekt({
        [type.name]: propertyCore,
        ...restCore.properties,
      })
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, type.name)
      const rest = type.rest
      assertTypesInCtx(ctx, rest, [
        Values.ClazzNull,
        Values.ClazzCons,
        Values.ClazzFulfilled,
      ])

      const propertyCore = readback(ctx, type.propertyType, propertyValue)
      const restCore = readbackObjekt(ctx, rest, value)

      return Cores.Objekt({
        [type.name]: propertyCore,
        ...restCore.properties,
      })
    }
  }
}
