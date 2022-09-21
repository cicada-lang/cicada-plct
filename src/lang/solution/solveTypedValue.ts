import { Ctx } from "../ctx"
import { Solution, solve, solveType } from "../solution"
import { TypedValue } from "../value"

export function solveTypedValue(
  solution: Solution,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): void {
  solveType(solution, ctx, left.type, right.type)
  solve(solution, ctx, left.type, left.value, right.value)
}
