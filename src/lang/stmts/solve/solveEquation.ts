import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, checkType, infer } from "../../exp"
import { deepWalk, Solution, solve } from "../../solution"
import { conversionType } from "../../value"
import { Equation } from "../solve"

export function solveEquation(
  solution: Solution,
  ctx: Ctx,
  equation: Equation,
): Solution {
  const env = solution.enrichCtx(ctx)

  switch (equation.kind) {
    case "EquationTyped": {
      const typeValue = evaluate(env, checkType(solution, ctx, equation.type))
      const leftValue = evaluate(
        env,
        check(solution, ctx, equation.left, typeValue),
      )
      const rightValue = evaluate(
        env,
        check(solution, ctx, equation.right, typeValue),
      )
      return solve(solution, ctx, typeValue, leftValue, rightValue)
    }

    case "EquationUntyped": {
      const leftInferred = infer(solution, ctx, equation.left)
      const rightInferred = infer(solution, ctx, equation.right)
      const leftType = deepWalk(solution, ctx, leftInferred.type)
      const rightType = deepWalk(solution, ctx, rightInferred.type)
      conversionType(ctx, leftType, rightType)
      const typeValue = leftType
      const leftValue = evaluate(env, leftInferred.core)
      const rightValue = evaluate(env, rightInferred.core)
      solution = solve(solution, ctx, typeValue, leftValue, rightValue)
      return solution
    }
  }
}
