// import { indent } from "../../utils/indent"
// import { Core } from "../core"
// import { Ctx } from "../ctx"
// import * as Errors from "../errors"
// import * as Exps from "../exp"
// import { include } from "../include"
// import { infer, insertApImplicitStep } from "../infer"
// import { checkByInfer } from "../check"
// import { Mod } from "../mod"
// import { safeFormatType, Value } from "../value"
import { checkByInfer } from "../check"
import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Mod } from "../mod"
import { Value } from "../value"

export function checkVar(mod: Mod, ctx: Ctx, exp: Exps.Var, type: Value): Core {
  return checkByInfer(mod, ctx, exp, type)

  // let inferred = infer(mod, ctx, exp)
  // while (inferred.type.kind === "PiImplicit") {
  //   try {
  //     include(mod, ctx, type, inferred.type)
  //     return inferred.core
  //   } catch (_error) {
  //     inferred = insertApImplicitStep(mod, ctx, inferred.type, inferred.core)
  //   }
  // }

  // try {
  //   include(mod, ctx, type, inferred.type)
  //   return inferred.core
  // } catch (error) {
  //   if (
  //     error instanceof Errors.UnificationError ||
  //     error instanceof Errors.InclusionError
  //   ) {
  //     throw new Errors.ElaborationError(
  //       [
  //         `[checkVar] fail`,
  //         indent(`var name: ${exp.name}`),
  //         indent(`inferred type: ${safeFormatType(mod, ctx, inferred.type)}`),
  //         indent(`given type: ${safeFormatType(mod, ctx, type)}`),
  //         ...error.trace,
  //         error.message,
  //       ].join("\n"),
  //       { span: exp.span },
  //     )
  //   }

  //   throw error
  // }
}
