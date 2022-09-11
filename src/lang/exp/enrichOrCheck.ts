import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, enrich, Exp } from "../exp"
import { Value } from "../value"

export function enrichOrCheck(
  ctx: Ctx,
  exp: Exp,
  type: Value,
): { type: Value; core: Core } {
  try {
    return enrich(ctx, exp, type)
  } catch (_error) {
    const core = check(ctx, exp, type)
    return { core, type }
  }
}
