import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, enrich, Exp } from "../exp"
import { Solution } from "../solution"
import { Value } from "../value"

export function enrichOrCheck(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): { type: Value; core: Core } {
  try {
    return enrich(solution, ctx, exp, type)
  } catch (_error) {
    const core = check(solution, ctx, exp, type)
    return { core, type }
  }
}
