import { Ctx } from "../../ctx"
import * as Values from "../../value"
import { assertTypesInCtx, Value } from "../../value"

export function assertClazzInCtx(
  ctx: Ctx,
  value: Value,
): asserts value is Values.Clazz {
  assertTypesInCtx(ctx, value, [
    Values.ClazzNull,
    Values.ClazzCons,
    Values.ClazzFulfilled,
  ])
}
