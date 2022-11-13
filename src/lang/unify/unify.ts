import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { Solution, solutionAdvanceValue } from "../solution"
import { unifyByType, unifyByValue, unifyMetaVar } from "../unify"
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
  solution: Solution,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  type = solutionAdvanceValue(mod, solution, type)
  left = solutionAdvanceValue(mod, solution, left)
  right = solutionAdvanceValue(mod, solution, right)

  try {
    return (
      unifyMetaVar(mod, ctx, solution, type, left, right) ||
      unifyByType(mod, ctx, solution, type, left, right) ||
      unifyByValue(mod, ctx, solution, type, left, right)
    )
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unify]`,
          indent(`type: ${formatType(mod, ctx, solution, type)}`),
          indent(`left: ${formatValue(mod, ctx, solution, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, solution, type, right)}`),
        ].join("\n"),
      )
    }

    if (error instanceof Errors.EvaluationError) {
      throw new Errors.UnificationError(
        [
          `[unify] EvaluationError during unification`,
          error.message,
          indent(`type: ${formatType(mod, ctx, solution, type)}`),
          indent(`left: ${formatValue(mod, ctx, solution, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, solution, type, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}
