import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution } from "../solution"
import { Value } from "../value"

export function solveType(
  solution: Solution,
  ctx: Ctx,
  left: Value,
  right: Value,
): Solution {
  if (left.kind === "Type" && right.kind === "Type") {
    return solution
  }

  if (left.kind === "String" && right.kind === "String") {
    return solution
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return solution
  }

  throw new ElaborationError(
    `solveType is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
