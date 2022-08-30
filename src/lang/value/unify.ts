import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution } from "./Solution"
import { Value } from "./Value"

export function unify(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value
): Solution {
  throw new ElaborationError(
    `unify is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`
  )
}
