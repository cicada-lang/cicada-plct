import type { Solution } from "../solution/index.js"

export function solutionNames(solution: Solution): Array<string> {
  return Array.from(solution.bindings.keys())
}
