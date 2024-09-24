import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import type * as Values from "../value/index.js"
import { assertTypesInCtx, type Value } from "../value/index.js"

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
