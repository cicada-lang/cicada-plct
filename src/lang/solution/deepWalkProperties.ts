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
): Record<string, Value> {
  switch (clazz.kind) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      let propertyValue = Actions.doDot(value, clazz.name)
      propertyValue = deepWalk(mod, ctx, clazz.propertyType, propertyValue)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      assertClazzInCtx(ctx, rest)
      return {
        [clazz.name]: propertyValue,
        ...deepWalkProperties(mod, ctx, rest, value),
      }
    }

    case "ClazzFulfilled": {
      let propertyValue = Actions.doDot(value, clazz.name)
      propertyValue = deepWalk(mod, ctx, clazz.propertyType, propertyValue)
      return {
        [clazz.name]: propertyValue,
        ...deepWalkProperties(mod, ctx, clazz.rest, value),
      }
    }
  }
}
