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
  throw new ElaborationError(
    `solveType is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
