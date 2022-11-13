import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { solutionAdvanceValue } from "../solution"
import { unifyByType, unifyByValue, unifyPatternVar } from "../unify"
import { formatType, formatValue, Value } from "../value"

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
  type = solutionAdvanceValue(mod, mod.solution, type)
  left = solutionAdvanceValue(mod, mod.solution, left)
  right = solutionAdvanceValue(mod, mod.solution, right)

  try {
    if (unifyPatternVar(mod, ctx, type, left, right)) return
    if (unifyByType(mod, ctx, type, left, right)) return
    unifyByValue(mod, ctx, type, left, right)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unify]`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left: ${formatValue(mod, ctx, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    if (error instanceof Errors.EvaluationError) {
      throw new Errors.UnificationError(
        [
          `[unify] EvaluationError during unification`,
          error.message,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left: ${formatValue(mod, ctx, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}
