import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, infer } from "../exp"
import { Solution } from "../solution"
import { inclusion, Value } from "../value"

export function checkByInfer(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Core {
  const inferred = infer(solution, ctx, exp)
  inclusion(ctx, inferred.type, type)
  return inferred.core
}
