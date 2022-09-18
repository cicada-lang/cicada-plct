import { Solution } from "../solution"

export function solutionNames(solution: Solution): Array<string> {
  switch (solution.kind) {
    case "SolutionNull": {
      return []
    }

    case "SolutionCons": {
      return [solution.name, ...solutionNames(solution.rest)]
    }
  }
}
