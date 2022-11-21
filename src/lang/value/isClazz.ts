import type * as Values from "../value"
import type { Value } from "../value"

export function isClazz(value: Value): value is Values.Clazz {
  return ["ClazzNull", "ClazzCons", "ClazzFulfilled"].includes(value["@kind"])
}
