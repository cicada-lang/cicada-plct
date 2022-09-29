import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Solution, unifyNeutral } from "../solution"
import { Value } from "../value"

export function unifyByValue(
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
    unifyNeutral(solution, ctx, left.neutral, right.neutral)
    return
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.data === right.data) {
      return
    }

    throw new Errors.EquationError(
      `unifyByValue expect left.data: ${left.data} to be the same as right.data: ${right.data}`,
    )
  }

  throw new Errors.EquationError(
    `unifyByValue is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
