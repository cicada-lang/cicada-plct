import type { Core } from "../core"
import type { Ctx } from "../ctx"
import * as Errors from "../errors"
import type { Exp } from "../exp"
import { include } from "../include"
import { infer } from "../infer"
import { Mod } from "../mod"
import type { Value } from "../value"

export function checkByInfer(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(mod, ctx, exp)

  try {
    include(mod, ctx, type, inferred.type)
  } catch (error) {
    if (error instanceof Errors.InclusionError) {
      throw new Errors.ElaborationError(
        [
          "[checkByInfer] meet InclusionError",
          ...error.trace,
          error.message,
        ].join("\n"),
        { span: exp.span },
      )
    }

    throw error
  }

  return inferred.core
}
