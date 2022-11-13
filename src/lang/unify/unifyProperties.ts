import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Solution } from "../solution"
import { unify } from "../unify"
import * as Values from "../value"
import { Value } from "../value"

export function unifyProperties(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): Solution {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      const leftProperty = Actions.doDot(left, clazz.name)
      const rightProperty = Actions.doDot(right, clazz.name)
      solution = unify(
        mod,
        ctx,
        solution,
        clazz.propertyType,
        leftProperty,
        rightProperty,
      )
      const rest = applyClosure(clazz.restClosure, leftProperty)
      Values.assertClazzInCtx(mod, ctx, rest)
      clazz = rest
    }

    if (clazz.kind === "ClazzFulfilled") {
      const leftProperty = Actions.doDot(left, clazz.name)
      const rightProperty = Actions.doDot(right, clazz.name)
      solution = unify(
        mod,
        ctx,
        solution,
        clazz.propertyType,
        leftProperty,
        rightProperty,
      )
      clazz = clazz.rest
    }
  }

  return solution
}
