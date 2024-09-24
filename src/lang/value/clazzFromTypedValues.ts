import type { TypedValue } from "../value/index.js"
import * as Values from "../value/index.js"

export function clazzFromTypedValues(
  typedValues: Record<string, TypedValue>,
): Values.Clazz {
  let clazz: Values.Clazz = Values.ClazzNull()
  for (const [name, { type, value }] of Object.entries(typedValues).reverse()) {
    clazz = Values.ClazzFulfilled(name, type, value, clazz)
  }

  return clazz
}
