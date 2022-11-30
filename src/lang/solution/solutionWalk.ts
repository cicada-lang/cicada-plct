import { Solution, solutionLookupValue } from "../solution"
import type { Value } from "../value"
import * as Values from "../value"

export function solutionWalk(solution: Solution, value: Value): Value {
  while (Values.isPatternVar(value)) {
    const found = solutionLookupValue(solution, value.neutral.name)
    if (found === undefined) return value
    value = found
  }

  return value
}
