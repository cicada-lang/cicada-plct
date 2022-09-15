import { Solution } from "../solution"
import { Value } from "../value"

export function lookupValueInSolution(
  solution: Solution,
  name: string,
): Value | undefined {
  switch (solution.kind) {
    case "SolutionNull": {
      return undefined
    }

    case "SolutionCons": {
      if (solution.name === name) {
        return solution.value
      } else {
        return lookupValueInSolution(solution.rest, name)
      }
    }
  }
}
