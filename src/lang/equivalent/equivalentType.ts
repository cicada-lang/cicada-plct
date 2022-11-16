import type { Ctx } from "../ctx"
import { equivalent } from "../equivalent"
import type { Mod } from "../mod"
import type { Value } from "../value"
import * as Values from "../value"

export function equivalentType(
  mod: Mod,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  equivalent(mod, ctx, Values.Type(), left, right)
}
