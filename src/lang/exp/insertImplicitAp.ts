import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Inferred } from "../exp"
import { Value } from "../value"

export function insertImplicitAp(
  ctx: Ctx,
  target: Core,
  type: Value,
  args: Array<Exps.Arg>,
): Inferred {
  const collected = Exps.collectPatternVars(ctx, type)

  ctx = collected.ctx
  type = collected.type

  throw new Error("TODO")
}
