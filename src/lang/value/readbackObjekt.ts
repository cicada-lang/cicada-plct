import * as Actions from "../actions"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import * as Values from "../value"
import { assertTypesInCtx, readback } from "../value"

export function readbackObjekt(
  ctx: Ctx,
  type: Values.Clazz,
  value: Values.Objekt
): Cores.Objekt {
  if (type.kind === "ClazzNull") {
    return Cores.Objekt({})
  } else {
    const propertyValue = Actions.doDot(value, type.name)
    const restType = Values.applyClosure(type.restClosure, propertyValue)
    assertTypesInCtx(ctx, restType, [
      Values.ClazzNull,
      Values.ClazzCons,
      Values.ClazzFulfilled,
    ])

    const propertyCore = readback(ctx, type.propertyType, propertyValue)
    const restCore = readbackObjekt(ctx, restType, value)

    return Cores.Objekt({
      [type.name]: propertyCore,
      ...restCore.properties,
    })
  }
}
