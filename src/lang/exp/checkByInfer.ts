import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, infer } from "../exp"
import { deepWalk, Solution, solveType } from "../solution"
import { inclusion, Value } from "../value"

export function checkByInfer(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Core {
  const inferred = infer(solution, ctx, exp)
  solution = solveType(solution, ctx, inferred.type, type)
  inclusion(
    ctx,
    deepWalk(solution, ctx, inferred.type),
    deepWalk(solution, ctx, type),
  )
  return inferred.core
}
