import { Ctx } from "../ctx"
import { Solution, solveByType, solveByValue, solveVar } from "../solution"
import { Value } from "../value"

/**

   # solve

   `solve` will be used during elaboration (`check` and `infer`),
   to support features like `ImplicitPi`.

   The recursion structure of `solve` closely follows `readback`,
   but dealing with two values in each step.

**/

export function solve(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  left = solution.walk(left)
  right = solution.walk(right)

  if (solveVar(solution, left, right)) return
  if (solveByType(solution, ctx, type, left, right)) return

  solveByValue(solution, ctx, type, left, right)
}
