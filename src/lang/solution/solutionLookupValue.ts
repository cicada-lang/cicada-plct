import { Solution } from "../solution"
import type { Value } from "../value"

export function solutionLookupValue(
  solution: Solution,
  name: string,
): Value | undefined {
  return solution.bindings.get(name)
}
