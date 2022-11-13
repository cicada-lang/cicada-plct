import { Solution } from "../solution"

export function solutionCleanup(solution: Solution): void {
  solution.metaVars = []
  solution.bindings = new Map()
}
