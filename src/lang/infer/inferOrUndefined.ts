import type { Ctx } from "../ctx/index.js"
import type { Exp } from "../exp/index.js"
import { infer, Inferred } from "../infer/index.js"
import type { Mod } from "../mod/index.js"

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
