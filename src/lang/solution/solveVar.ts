import { isPatternVar, Solution } from "../solution"
import { Value } from "../value"

export function solveVar(
  solution: Solution,
  left: Value,
  right: Value,
): Solution | undefined {
  if (isPatternVar(left) && isPatternVar(right)) {
    if (left.neutral.name === right.neutral.name) {
      return solution
    }
  }

  if (isPatternVar(left)) {
    // TODO Need occur check to avoid circular unification.
    return solution.bind(left.neutral.name, right)
  }

  if (isPatternVar(right)) {
    // TODO Need occur check to avoid circular unification.
    return solution.bind(right.neutral.name, left)
  }

  return undefined
}
