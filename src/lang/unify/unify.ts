import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { advanceValue } from "../solution"
import { unifyByType, unifyByValue, unifyPatternVar } from "../unify"
import { safeFormat, safeFormatType, Value } from "../value"

/**

   # unify

   `unify` will be used during elaboration (`check` and `infer`),
   to support features like `PiImplicit`.

   The recursion structure of `unify` closely follows `readback`,
   but dealing with two values in each step.

**/

export function unify(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  type = advanceValue(mod, type)
  left = advanceValue(mod, left)
  right = advanceValue(mod, right)

  try {
    if (unifyPatternVar(mod, ctx, type, left, right)) return
    if (unifyByType(mod, ctx, type, left, right)) return
    unifyByValue(mod, ctx, type, left, right)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unify]`,
          indent(`type: ${safeFormatType(mod, ctx, type)}`),
          indent(`left: ${safeFormat(mod, ctx, type, left)}`),
          indent(`right: ${safeFormat(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}
