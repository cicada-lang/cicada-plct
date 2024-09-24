import type { Solution } from "../solution/index.js"
import type { Value } from "../value/index.js"

export function solutionLookupValue(
  solution: Solution,
  name: string,
): Value | undefined {
  return solution.bindings.get(name)
}
