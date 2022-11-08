import { indent } from "../../utils/indent"
import { Core, formatCore } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../solution"
import { inclusion, readbackType, Value } from "../value"

export function checkVar(mod: Mod, ctx: Ctx, exp: Exps.Var, type: Value): Core {
  const inferred = Exps.infer(mod, ctx, exp)
  const inserted = Exps.insertApImplicit(mod, ctx, inferred)

  try {
    unifyType(mod, ctx, inserted.type, type)
    inclusion(mod, ctx, inserted.type, type)
    return inserted.core
  } catch (error) {
    if (
      error instanceof Errors.UnificationError ||
      error instanceof Errors.InclusionError
    ) {
      throw new Errors.ElaborationError(
        [
          `check Var fail to checkInferred`,
          indent(`var name: ${exp.name}`),
          indent(
            `inferred type: ${formatCore(
              readbackType(mod, ctx, inferred.type),
            )}`,
          ),
          indent(`inserted core: ${formatCore(inserted.core)}`),
          indent(
            `inserted type: ${formatCore(
              readbackType(mod, ctx, inserted.type),
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
