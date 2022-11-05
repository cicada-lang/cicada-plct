import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { occur, Solution } from "../solution"
import { Value } from "../value"

export function unifyPatternVar(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  if (
    solution.isPatternVar(left) &&
    solution.isPatternVar(right) &&
    left.neutral.name === right.neutral.name
  ) {
    return "ok"
  }

  if (solution.isPatternVar(left)) {
    if (occur(solution, ctx, left.neutral.name, type, right)) {
      throw new Errors.UnificationError(
        `${left.neutral.name} occurs in ${right.kind}`,
      )
    }

    solution.bindings.set(left.neutral.name, right)
    return "ok"
  }

  if (solution.isPatternVar(right)) {
    if (occur(solution, ctx, right.neutral.name, type, left)) {
      throw new Errors.UnificationError(
        `${right.neutral.name} occurs in ${left.kind}`,
      )
    }

    solution.bindings.set(right.neutral.name, left)
    return "ok"
  }
}
