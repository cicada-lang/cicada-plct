import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution, solveNeutral } from "../solution"
import { Value } from "../value"

export function solveByValue(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    return solveNeutral(solution, ctx, left.neutral, right.neutral)
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.literal === right.literal) {
      return solution
    }

    throw new ElaborationError(
      `solveByValue expect left.literal: ${left.literal} to be the same as right.literal: ${right.literal}`,
    )
  }

  throw new ElaborationError(
    `solveByValue is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
