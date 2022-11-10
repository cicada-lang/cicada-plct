import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Exp, infer } from "../exp"
import { Mod } from "../mod"
import { include, Value } from "../value"

export function checkByInfer(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(mod, ctx, exp)

  try {
    // unifyType(mod, ctx, inferred.type, type)
    include(mod, ctx, inferred.type, type)
  } catch (error) {
    if (
      error instanceof Errors.UnificationError ||
      error instanceof Errors.InclusionError
    ) {
      throw new Errors.ElaborationError(
        ["checkByInfer fail", ...error.trace, error.message].join("\n"),
        { span: exp.span },
      )
    }

    throw error
  }

  return inferred.core
}
