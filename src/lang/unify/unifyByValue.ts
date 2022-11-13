import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { Solution } from "../solution"
import { unify, unifyNeutral, unifyType } from "../unify"
import { formatType, formatValue, Value } from "../value"

export function unifyByValue(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    solution = unifyNeutral(mod, ctx, solution, left.neutral, right.neutral)
    return solution
  }

  if (left.kind === "Sole" && right.kind === "Sole") {
    return solution
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.data === right.data) {
      return solution
    }

    throw new Errors.UnificationError(
      [
        `[unifyByValue] expect strings to be the same`,
        `  left: ${left.data}`,
        `  right: ${right.data}`,
      ].join("\n"),
    )
  }

  if (left.kind === "Refl" && right.kind === "Refl") {
    solution = unifyType(mod, ctx, solution, left.type, right.type)
    solution = unify(mod, ctx, solution, left.type, left.value, right.value)
    return solution
  }

  throw new Errors.UnificationError(
    [
      `[unifyByValue] is not implemented for the pair of values`,
      indent(`type: ${formatType(mod, ctx, solution, type)}`),
      indent(`left: ${formatValue(mod, ctx, solution, type, left)}`),
      indent(`right: ${formatValue(mod, ctx, solution, type, right)}`),
    ].join("\n"),
  )
}
