import * as Values from "../../value"
import { assertValues, Value } from "../../value"

export function assertClazz(value: Value): asserts value is Values.Clazz {
  assertValues(value, ["ClazzNull", "ClazzCons", "ClazzFulfilled"])
}
