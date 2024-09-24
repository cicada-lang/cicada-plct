import { check } from "../check/index.js"
import type { Core } from "../core/index.js"
import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { ctxToEnv } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import { evaluate } from "../evaluate/index.js"
import type { Exp } from "../exp/index.js"
import { Inferred } from "../infer/index.js"
import type { Mod } from "../mod/index.js"
import * as Values from "../value/index.js"

export function inferFulfillingClazz(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred | undefined {
  const targetValue = evaluate(ctxToEnv(ctx), inferred.core)
  if (!Values.isClazz(targetValue)) return undefined

  const argCore = checkFulfilledArg(mod, ctx, targetValue, argExp)
  return Inferred(Values.Type(), Cores.Ap(inferred.core, argCore))
}

function checkFulfilledArg(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  arg: Exp,
): Core {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      throw new Errors.ElaborationError(
        "[checkFulfilledArg] cannot apply argument to ClazzNull",
        { span: arg.span },
      )
    }

    case "ClazzCons": {
      return check(mod, ctx, arg, clazz.propertyType)
    }

    case "ClazzFulfilled": {
      return checkFulfilledArg(mod, ctx, clazz.rest, arg)
    }
  }
}
