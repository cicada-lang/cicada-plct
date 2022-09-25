import { Ctx } from "../ctx"
import { EquationError } from "../errors"
import { Solution, solveNeutral } from "../solution"
import { Value } from "../value"

export function solveByValue(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/
    solveNeutral(solution, ctx, left.neutral, right.neutral)
    return
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.data === right.data) {
      return
    }

    throw new EquationError(
      `solveByValue expect left.data: ${left.data} to be the same as right.data: ${right.data}`,
    )
  }

  throw new EquationError(
    `solveByValue is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
