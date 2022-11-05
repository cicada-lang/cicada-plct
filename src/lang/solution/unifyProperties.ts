import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Solution, unify } from "../solution"
import * as Values from "../value"
import { assertClazzInCtx, Value } from "../value"

export function unifyProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): Solution {
  switch (clazz.kind) {
    case "ClazzNull": {
      return mod.solution
    }

    case "ClazzCons": {
      const leftPropertyValue = Actions.doDot(left, clazz.name)
      const rightPropertyValue = Actions.doDot(right, clazz.name)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      const rest = applyClosure(clazz.restClosure, leftPropertyValue)
      assertClazzInCtx(ctx, rest)
      return unifyProperties(mod, ctx, rest, left, right)
    }

    case "ClazzFulfilled": {
      const leftPropertyValue = Actions.doDot(left, clazz.name)
      const rightPropertyValue = Actions.doDot(right, clazz.name)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      return unifyProperties(mod, ctx, clazz.rest, left, right)
    }
  }
}
