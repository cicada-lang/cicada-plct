import * as Values from "./Value"
import { Value } from "./Value"

export function isClazz(value: Value): value is Values.Clazz {
  return ["ClazzNull", "ClazzCons", "ClazzFulfilled"].includes(value.kind)
}
