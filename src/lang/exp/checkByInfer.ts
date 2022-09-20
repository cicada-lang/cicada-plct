import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer } from "../exp"
import { inclusion, Value } from "../value"

export function checkByInfer(ctx: Ctx, exp: Exp, type: Value): Core {
  const core = Exps.checkImplicitApInsertion(ctx, exp, type)
  if (core !== undefined) return core

  const inferred = infer(ctx, exp)
  inclusion(ctx, inferred.type, type)
  return inferred.core
}
