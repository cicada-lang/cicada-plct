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
    if (error instanceof Errors.LangError)
      throw new Errors.ElaborationError(error.message, { span: exp.span })
    throw error
  }

  return inferred.core
}

export function checkInferred(mod: Mod, ctx: Ctx, inferred: Inferred, type: Value): Core {
  let inferredType = inferred.type
  let givenType = type

  /**
     NOTE We need to use `deepWalkType` before `unifyType`,
     because `deepWalkType` might further `evaluate` a `Neutral`.
  **/

  inferredType = mod.solution.deepWalkType(mod, ctx, inferredType)
  givenType = mod.solution.deepWalkType(mod, ctx, givenType)

  unifyType(mod.solution, ctx, inferredType, givenType)

  /**
     NOTE Because `unifyType` might do side-effect on `mod.solution`,
     we need to do `deepWalkType` again.
  **/

  inferredType = mod.solution.deepWalkType(mod, ctx, inferredType)
  givenType = mod.solution.deepWalkType(mod, ctx, givenType)

  inclusion(mod, ctx, inferredType, givenType)

  return inferred.core
}
