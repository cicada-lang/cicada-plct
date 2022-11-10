import { Ctx } from "../ctx"
import { Mod } from "../mod"
import * as Values from "../value"
import { equivalent, Value } from "../value"

export function equivalentType(
  mod: Mod,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  equivalent(mod, ctx, Values.Type(), left, right)
}
