import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution } from "../solution"
import { Value } from "../value"

export function solveByValue(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution {
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
