import * as Actions from "../actions"
import type { Value } from "../value"
import * as Values from "../value"

export function clazzLookupProperty(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.propertyName === name) return undefined
      const property = Actions.doDot(target, clazz.propertyName)
      clazz = Values.clazzClosureApply(clazz.restClosure, property)
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (clazz.propertyName === name) return clazz.property
      clazz = clazz.rest
    }
  }

  return undefined
}
