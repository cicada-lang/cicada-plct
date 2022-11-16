import { Solution } from "../solution"

export function solutionCleanup(solution: Solution): void {
  solution.bindings = new Map()
}
