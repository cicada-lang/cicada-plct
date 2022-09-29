import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, infer } from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../solution"
import { inclusion, Value } from "../value"

export function checkByInfer(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(mod, ctx, exp)
  unifyType(mod.solution, ctx, inferred.type, type)
  inclusion(
    mod,
    ctx,
    mod.solution.deepWalkType(mod, ctx, inferred.type),
    mod.solution.deepWalkType(mod, ctx, type),
  )
  return inferred.core
}
