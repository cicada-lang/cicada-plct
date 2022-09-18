import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, infer } from "../exp"
import { deepWalk, Solution } from "../solution"
import { inclusion, Value } from "../value"

export function checkByInfer(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Core {
  const inferred = infer(solution, ctx, exp)
  inclusion(ctx, deepWalk(solution, inferred.type), deepWalk(solution, type))
  return inferred.core
}
