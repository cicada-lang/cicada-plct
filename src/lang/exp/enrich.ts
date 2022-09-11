import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, Exp } from "../exp"
import { Value } from "../value"

export function enrich(
  ctx: Ctx,
  exp: Exp,
  type: Value,
): { type: Value; core: Core } {
  switch (exp.kind) {
    default: {
      const core = check(ctx, exp, type)
      return { core, type }
    }
  }
}
