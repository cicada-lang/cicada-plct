import type { Ctx } from "../ctx"
import type { Exp } from "../exp"
import { infer, Inferred } from "../infer"
import { Mod } from "../mod"

export function inferOrUndefined(
  mod: Mod,
  ctx: Ctx,
  exp: Exp,
): Inferred | undefined {
  try {
    return infer(mod, ctx, exp)
  } catch (_error) {
    return undefined
  }
}
