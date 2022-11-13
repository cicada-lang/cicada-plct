import { Solution } from "../solution"

export function solutionCleanup(solution: Solution): void {
  solution.patternVars = []
  solution.bindings = new Map()
}
