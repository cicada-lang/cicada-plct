import { Ctx } from "../ctx"
import { Solution, solve } from "../solution"
import * as Values from "../value"
import { TypedValue } from "../value"

export function solveTypedValue(
  solution: Solution,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): Solution {
  solution = solve(solution, ctx, Values.Type(), left.type, right.type)
  solution = solve(solution, ctx, left.type, left.value, right.value)
  return solution
}
