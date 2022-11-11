import { indent } from "../../utils/indent"
import { Core, formatCore } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { include } from "../include"
import { infer, insertApImplicitStep } from "../infer"
import { Mod } from "../mod"
import { readbackType, Value } from "../value"

export function checkVar(mod: Mod, ctx: Ctx, exp: Exps.Var, type: Value): Core {
  let inferred = infer(mod, ctx, exp)
  while (inferred.type.kind === "PiImplicit") {
    try {
      include(mod, ctx, type, inferred.type)
      return inferred.core
    } catch (_error) {
      inferred = insertApImplicitStep(mod, ctx, inferred.type, inferred.core)
    }
  }

  try {
    include(mod, ctx, type, inferred.type)
    return inferred.core
  } catch (error) {
    if (
      error instanceof Errors.UnificationError ||
      error instanceof Errors.InclusionError
    ) {
      throw new Errors.ElaborationError(
        [
          `checkVar fail`,
          indent(`var name: ${exp.name}`),
          indent(
            `inferred type: ${formatCore(
              readbackType(mod, ctx, inferred.type),
            )}`,
          ),
          indent(`given type: ${formatCore(readbackType(mod, ctx, type))}`),
          ...error.trace,
          error.message,
        ].join("\n"),
        { span: exp.span },
      )
    }

    throw error
  }
}
