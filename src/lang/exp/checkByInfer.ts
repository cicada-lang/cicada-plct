import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, infer } from "../exp"
import { Mod } from "../mod"
import { solveType } from "../solution"
import { inclusion, Value } from "../value"

export function checkByInfer(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(mod, ctx, exp)
  solveType(mod.solution, ctx, inferred.type, type)
  inclusion(
    ctx,
    mod.solution.deepWalk(ctx, inferred.type),
    mod.solution.deepWalk(ctx, type),
  )
  return inferred.core
}
