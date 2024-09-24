import type { Solution } from "../solution/index.js"

export function solutionCleanup(solution: Solution): void {
  solution.bindings = new Map()
}
