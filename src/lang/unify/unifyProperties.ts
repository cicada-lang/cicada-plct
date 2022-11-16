import * as Actions from "../actions"
import { closureApply } from "../closure"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { unify } from "../unify"
import * as Values from "../value"
import { Value } from "../value"

export function unifyProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): void {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      const rest = closureApply(clazz.restClosure, leftPropertyValue)
      Values.assertClazzInCtx(mod, ctx, rest)
      clazz = rest
    }

    if (clazz.kind === "ClazzFulfilled") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      clazz = clazz.rest
    }
  }
}
