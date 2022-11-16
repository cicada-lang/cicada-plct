import { Solution } from "../solution"
import { Value } from "../value"

export function solutionLookupValue(
  solution: Solution,
  name: string,
): Value | undefined {
  return solution.bindings.get(name)
}
