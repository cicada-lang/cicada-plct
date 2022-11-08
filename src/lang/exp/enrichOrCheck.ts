import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, Exp } from "../exp"
import { Mod } from "../mod"
import { Value } from "../value"

export function enrichOrCheck(
  mod: Mod,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): { type: Value; core: Core } {
  const core = check(mod, ctx, exp, type)
  return { core, type }
  // try {
  //   return enrich(mod, ctx, exp, type)
  // } catch (_error) {
  //   const core = check(mod, ctx, exp, type)
  //   return { core, type }
  // }
}
