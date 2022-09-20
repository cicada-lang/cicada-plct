import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Insertions from "../insertion"
import { Solution } from "../solution"
import { Value } from "../value"

export function solveRetType(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  retType: Value,
  insertions: Array<Insertions.Insertion> = [],
): {
  solution: Solution
  type: Value
  insertions: Array<Insertions.Insertion>
} {
  throw new ElaborationError(
    `expect type to ImplicitPi instead of: ${type.kind}`,
  )
}
