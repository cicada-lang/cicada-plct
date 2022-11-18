import { check } from "../check"
import type { Core } from "../core"
import * as Cores from "../core"
import type { Ctx } from "../ctx"
import { ctxToEnv } from "../ctx"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import type { Exp } from "../exp"
import { Inferred } from "../infer"
import type { Mod } from "../mod"
import * as Values from "../value"

export function inferFulfillingClazz(
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

function checkClazzArg(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  arg: Exp,
): Core {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new Errors.ElaborationError(
        "[checkClazzArg] cannot apply argument to ClazzNull",
        { span: arg.span },
      )
    }

    case "ClazzCons": {
      return check(mod, ctx, arg, clazz.propertyType)
    }

    case "ClazzFulfilled": {
      return checkClazzArg(mod, ctx, clazz.rest, arg)
    }
  }
}
