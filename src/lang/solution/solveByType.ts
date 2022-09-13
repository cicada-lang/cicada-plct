import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Solution } from "../solution"
import { Value } from "../value"

export function solveByType(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution | undefined {
  return undefined

  throw new ElaborationError(
    `solveByType is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
