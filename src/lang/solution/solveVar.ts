import { Solution } from "../solution"
import { Value } from "../value"

export function solveVar(
  solution: Solution,
  left: Value,
  right: Value,
): Solution | undefined {
  if (solution.isPatternVar(left) && solution.isPatternVar(right)) {
    if (left.neutral.name === right.neutral.name) {
      return solution
    }
  }

  if (solution.isPatternVar(left)) {
    // TODO Need occur check to avoid circular unification.
    solution.bind(left.neutral.name, right)
    return solution
  }

  if (solution.isPatternVar(right)) {
    // TODO Need occur check to avoid circular unification.
    solution.bind(right.neutral.name, left)
    return solution
  }

  return undefined
}
