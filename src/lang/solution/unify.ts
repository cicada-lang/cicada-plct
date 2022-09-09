import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution } from "../solution"
import { Value } from "../value"

export function unify(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  throw new ElaborationError(
    `unify is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
