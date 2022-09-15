import { Ctx } from "../ctx"
import {
  isPatternVar,
  lookupValueInSolution,
  Solution,
  SolutionCons,
  solveByType,
  solveByValue,
} from "../solution"
import { Value } from "../value"

/**

   # solve

   `solve` will be used during elaboration (`check` and `infer`),
   to support features like `ImplicitPi`.

   The recursion structure of `solve` closely follows `readback`,
   but dealing with two values in each step.

   Note that, we should always
   recursive call to `solve` (not `solveType`),
   because `solve` handles `walk` and `PatternVar`.

**/

export function solve(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  left = walk(solution, left)
  right = walk(solution, right)

  if (isPatternVar(left) && isPatternVar(right)) {
    if (left.neutral.name === right.neutral.name) {
      return solution
    }
  }

  if (isPatternVar(left)) {
    // TODO Need occur check to avoid circular unification.
    return SolutionCons(left.neutral.name, right, solution)
  }

  if (isPatternVar(right)) {
    // TODO Need occur check to avoid circular unification.
    return SolutionCons(right.neutral.name, left, solution)
  }

  return (
    solveByType(solution, ctx, type, left, right) ||
    solveByValue(solution, ctx, type, left, right)
  )
}

function walk(solution: Solution, value: Value): Value {
  while (isPatternVar(value)) {
    const found = lookupValueInSolution(solution, value.neutral.name)
    if (found === undefined) return value
    value = found
  }

  return value
}
