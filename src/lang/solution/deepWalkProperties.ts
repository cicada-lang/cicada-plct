import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { deepWalk } from "../solution"
import * as Values from "../value"
import { assertClazzInCtx, Value } from "../value"

export function deepWalkProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  value: Value,
  properties: Record<string, Value> = {},
): Record<string, Value> {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      let propertyValue = Actions.doDot(value, clazz.name)
      propertyValue = deepWalk(mod, ctx, clazz.propertyType, propertyValue)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      assertClazzInCtx(ctx, rest)
      properties[clazz.name] = propertyValue
      clazz = rest
    }

    if (clazz.kind === "ClazzFulfilled") {
      let propertyValue = Actions.doDot(value, clazz.name)
      propertyValue = deepWalk(mod, ctx, clazz.propertyType, propertyValue)
      properties[clazz.name] = propertyValue
      clazz = clazz.rest
    }
  }

  return properties
}
