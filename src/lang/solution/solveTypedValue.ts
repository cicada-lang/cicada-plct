import { Ctx } from "../ctx"
import { Solution, solve, solveType } from "../solution"
import { TypedValue } from "../value"

export function solveTypedValue(
  solution: Solution,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): Solution {
  solution = solveType(solution, ctx, left.type, right.type)
  solution = solve(solution, ctx, left.type, left.value, right.value)
  return solution
}
