import { isPatternVar, lookupValueInSolution, Solution } from "../solution"
import { Value } from "../value"

export function walk(solution: Solution, value: Value): Value {
  while (isPatternVar(value)) {
    const found = lookupValueInSolution(solution, value.neutral.name)
    if (found === undefined) return value
    value = found
  }

  return value
}
