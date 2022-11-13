import { isPatternVar, Solution } from "../solution"
import { Value } from "../value"

export function solutionLookupValue(
  solution: Solution,
  name: string,
): Value | undefined {
  const value = solution.bindings.get(name)
  if (value === undefined) return undefined
  if (isPatternVar(solution, value) && value.neutral.name === name)
    return undefined
  return value
}
