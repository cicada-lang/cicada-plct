import type { Value } from "../value"
import * as Values from "../value"

export function isClazz(value: Value): value is Values.Clazz {
  return ["ClazzNull", "ClazzCons", "ClazzFulfilled"].includes(value.kind)
}
