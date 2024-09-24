import type * as Values from "../value/index.js"
import type { Value } from "../value/index.js"

export function isClazz(value: Value): value is Values.Clazz {
  return ["ClazzNull", "ClazzCons", "ClazzFulfilled"].includes(value["@kind"])
}
