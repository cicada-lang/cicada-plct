import { isPatternVar, Solution, SolutionCons } from "../solution"
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
    return SolutionCons(left.neutral.name, right, solution)
  }

  if (isPatternVar(right)) {
    // TODO Need occur check to avoid circular unification.
    return SolutionCons(right.neutral.name, left, solution)
  }

  return undefined
}
