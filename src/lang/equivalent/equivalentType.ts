import { Ctx } from "../ctx"
import { equivalent } from "../equivalent"
import { Mod } from "../mod"
import * as Values from "../value"
import { Value } from "../value"

export function equivalentType(
  mod: Mod,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  equivalent(mod, ctx, Values.Type(), left, right)
}
