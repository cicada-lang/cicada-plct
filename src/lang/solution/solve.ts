import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution } from "../solution"
import { Value } from "../value"

export function solve(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  throw new ElaborationError(
    `solve is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
