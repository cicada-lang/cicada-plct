import type { Solution } from "../solution/index.js"
import type { Value } from "../value/index.js"

export function solutionBind(
  solution: Solution,
  name: string,
  value: Value,
): Solution {
  solution.bindings.set(name, value)
  return solution
}
