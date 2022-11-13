import { Solution, solutionLookupValue } from "../solution"
import { Value } from "../value"

export function solutionWalk(solution: Solution, value: Value): Value {
  while (solution.isPatternVar(value)) {
    const found = solutionLookupValue(solution, value.neutral.name)
    if (found === undefined) return value
    value = found
  }

  return value
}
