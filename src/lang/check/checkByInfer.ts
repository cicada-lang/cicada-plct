import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Exp } from "../exp/index.js"
import { include } from "../include/index.js"
import { infer } from "../infer/index.js"
import type { Mod } from "../mod/index.js"
import type { Value } from "../value/index.js"

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
