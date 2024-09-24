import { Solution, solutionLookupValue } from "../solution/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function solutionWalk(solution: Solution, value: Value): Value {
  while (Values.isPatternVar(value)) {
    const found = solutionLookupValue(solution, value.neutral.name)
    if (found === undefined) return value
    value = found
  }

  return value
}
