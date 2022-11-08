import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../solution"
import * as Values from "../value"
import { inclusion, Value } from "../value"

export function checkVar(mod: Mod, ctx: Ctx, exp: Exps.Var, type: Value): Core {
  let inferred = Exps.infer(mod, ctx, exp)
  while (Values.isValue(inferred.type, "PiImplicit")) {
    try {
      unifyType(mod, ctx, inferred.type, type)
      inclusion(mod, ctx, inferred.type, type)
      return inferred.core
    } catch (_error) {
      inferred = Exps.insertApImplicitStep(
        mod,
        ctx,
        inferred.type,
        inferred.core,
      )
    }
  }

  unifyType(mod, ctx, inferred.type, type)
  inclusion(mod, ctx, inferred.type, type)
  return inferred.core
}
