import { Ctx } from "../ctx"
import { Mod } from "../mod"
import * as Values from "../value"
import { assertTypesInCtx, Value } from "../value"

export function assertClazzInCtx(
  mod: Mod,
  ctx: Ctx,
  value: Value,
): asserts value is Values.Clazz {
  assertTypesInCtx(mod, ctx, value, [
    "ClazzNull",
    "ClazzCons",
    "ClazzFulfilled",
  ])
}
