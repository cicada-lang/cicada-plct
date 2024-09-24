import * as Actions from "../actions/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { unify } from "../unify/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function unifyProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): void {
  while (clazz["@kind"] !== "ClazzNull") {
    if (clazz["@kind"] === "ClazzCons") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      clazz = Values.clazzClosureApply(clazz.restClosure, leftPropertyValue)
    }

    if (clazz["@kind"] === "ClazzFulfilled") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      unify(mod, ctx, clazz.propertyType, leftPropertyValue, rightPropertyValue)
      clazz = clazz.rest
    }
  }
}
