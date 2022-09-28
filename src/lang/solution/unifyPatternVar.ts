import { Solution } from "../solution"
import { Value } from "../value"

export function unifyPatternVar(
  solution: Solution,
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
    // TODO Need occur check to avoid circular unification.
    solution.bind(left.neutral.name, right)
    return "ok"
  }

  if (solution.isPatternVar(right)) {
    // TODO Need occur check to avoid circular unification.
    solution.bind(right.neutral.name, left)
    return "ok"
  }
}
