import { Ctx } from "../ctx"
import { Exp, infer, Inferred } from "../exp"
import { Solution } from "../solution"

export function inferOrUndefined(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
): Inferred | undefined {
  try {
    return infer(solution, ctx, exp)
  } catch (_error) {
    return undefined
  }
}
