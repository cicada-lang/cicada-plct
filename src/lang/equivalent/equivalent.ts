import { indent } from "../../utils/indent"
import type { Ctx } from "../ctx"
import { equivalentByType, equivalentByValue } from "../equivalent"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import { solutionAdvanceValue } from "../solution"
import type { Value } from "../value"
import { formatType, formatValue } from "../value"

/**

   # equivalent

   `equivalent` needs to handle eta-rules.

**/

export function equivalent(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  type = solutionAdvanceValue(mod, type)
  left = solutionAdvanceValue(mod, left)
  right = solutionAdvanceValue(mod, right)

  try {
    if (equivalentByType(mod, ctx, type, left, right)) return
    equivalentByValue(mod, ctx, type, left, right)
  } catch (error) {
    if (error instanceof Errors.EquivalenceError) {
      error.trace.unshift(
        [
          `[equivalent]`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left: ${formatValue(mod, ctx, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    if (error instanceof Errors.EvaluationError) {
      throw new Errors.EquivalenceError(
        [
          `[equivalent] EvaluationError during equivalent`,
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
