import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Exp, infer, Inferred } from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../solution"
import { inclusion, Value } from "../value"

export function checkByInfer(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(mod, ctx, exp)

  try {
    checkInferred(mod, ctx, inferred, type)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      throw new Errors.ElaborationError(
        ["checkByInfer fail", ...error.trace, error.message].join("\n"),
        { span: exp.span },
      )
    }

    throw error
  }

  return inferred.core
}

export function checkInferred(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  type: Value,
): Core {
  unifyType(mod, ctx, inferred.type, type)
  inclusion(mod, ctx, inferred.type, type)
  return inferred.core
}
