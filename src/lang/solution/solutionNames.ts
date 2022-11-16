import type { Solution } from "../solution"

export function solutionNames(solution: Solution): Array<string> {
  return Array.from(solution.bindings.keys())
}
