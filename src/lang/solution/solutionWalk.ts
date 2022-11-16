import { Solution, solutionLookupValue } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function solutionWalk(solution: Solution, value: Value): Value {
  while (Values.isMetaVar(value)) {
    const found = solutionLookupValue(solution, value.neutral.name)
    if (found === undefined) return value
    value = found
  }

  return value
}
