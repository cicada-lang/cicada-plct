import { checkClazzArg } from "../check"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import { evaluate } from "../evaluate"
import { Exp, Inferred } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"

export function inferFulfillingType(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred | undefined {
  const targetValue = evaluate(mod.ctxToEnv(ctx), inferred.core)
  if (!Values.isClazz(targetValue)) return undefined

  const argCore = checkClazzArg(mod, ctx, targetValue, argExp)
  return Inferred(Values.Type(), Cores.Ap(inferred.core, argCore))
}
