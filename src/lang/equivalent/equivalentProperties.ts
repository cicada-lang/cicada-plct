import * as Actions from "../actions"
import type { Ctx } from "../ctx"
import { equivalent } from "../equivalent"
import type { Mod } from "../mod"
import type { Value } from "../value"
import * as Values from "../value"

export function equivalentProperties(
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
      equivalent(
        mod,
        ctx,
        clazz.propertyType,
        leftPropertyValue,
        rightPropertyValue,
      )
      clazz = Values.clazzClosureApply(clazz.restClosure, leftPropertyValue)
    }

    if (clazz["@kind"] === "ClazzFulfilled") {
      const leftPropertyValue = Actions.doDot(left, clazz.propertyName)
      const rightPropertyValue = Actions.doDot(right, clazz.propertyName)
      equivalent(
        mod,
        ctx,
        clazz.propertyType,
        leftPropertyValue,
        rightPropertyValue,
      )
      clazz = clazz.rest
    }
  }
}
