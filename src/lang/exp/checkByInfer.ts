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
    if (error instanceof Errors.LangError) {
      throw new Errors.ElaborationError(error.message, { span: exp.span })
    } else throw error
  }

  return inferred.core
}

export function checkInferred(mod: Mod, ctx: Ctx, inferred: Inferred, type: Value): Core {
  unifyType(mod.solution, ctx, inferred.type, type)
  inclusion(
    mod,
    ctx,
    mod.solution.deepWalkType(mod, ctx, inferred.type),
    mod.solution.deepWalkType(mod, ctx, type),
  )
  return inferred.core
}
