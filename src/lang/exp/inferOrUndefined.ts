import { Ctx } from "../ctx"
import { Exp, infer, Inferred } from "../exp"

export function inferOrUndefined(ctx: Ctx, exp: Exp): Inferred | undefined {
  try {
    return infer(ctx, exp)
  } catch (_error) {
    return undefined
  }
}
