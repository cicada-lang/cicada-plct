import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp, infer } from "../exp"
import * as Insertions from "../insertion"
import { inclusion, Value } from "../value"

export function checkByInfer(ctx: Ctx, exp: Exp, type: Value): Core {
  Insertions.solveRetType
  const inferred = infer(ctx, exp)
  inclusion(ctx, inferred.type, type)
  return inferred.core
}
