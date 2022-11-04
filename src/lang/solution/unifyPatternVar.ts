import * as Errors from "../errors"
import { Solution } from "../solution"
import { Value } from "../value"
import { occur } from "./occur"

export function unifyPatternVar(
  solution: Solution,
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
    if (occur(left.neutral.name, type, right)) {
      throw new Errors.UnificationError(
        `${left.neutral.name} occurs in ${right.kind}`,
      )
    }

    solution.bind(left.neutral.name, right)
    return "ok"
  }

  if (solution.isPatternVar(right)) {
    if (occur(right.neutral.name, type, left)) {
      throw new Errors.UnificationError(
        `${right.neutral.name} occurs in ${left.kind}`,
      )
    }

    solution.bind(right.neutral.name, left)
    return "ok"
  }
}
