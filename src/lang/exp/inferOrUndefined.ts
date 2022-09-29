import { Ctx } from "../ctx"
import { Exp, infer, Inferred } from "../exp"
import { Mod } from "../mod"

export function inferOrUndefined(mod: Mod, ctx: Ctx, exp: Exp): Inferred | undefined {
  try {
    return infer(mod, ctx, exp)
  } catch (_error) {
    return undefined
  }
}
