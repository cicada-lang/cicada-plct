import { checkClazzArg } from "../check"
import * as Cores from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import { evaluate } from "../evaluate"
import type { Exp } from "../exp"
import { Inferred } from "../infer"
import { Mod } from "../mod"
import * as Values from "../value"

export function inferFulfillingType(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred | undefined {
  const targetValue = evaluate(ctxToEnv(ctx), inferred.core)
  if (!Values.isClazz(targetValue)) return undefined

  const argCore = checkClazzArg(mod, ctx, targetValue, argExp)
  return Inferred(Values.Type(), Cores.Ap(inferred.core, argCore))
}
