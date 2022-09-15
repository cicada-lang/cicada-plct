import { evaluate } from "../../core"
import { Ctx, ctxToEnv } from "../../ctx"
import { check, checkType, infer } from "../../exp"
import { Solution, solve } from "../../solution"
import { conversionType } from "../../value"
import { Equation } from "../solve"

export function solveEquation(
  solution: Solution,
  ctx: Ctx,
  equation: Equation,
): Solution {
  const env = ctxToEnv(ctx)

  switch (equation.kind) {
    case "EquationTyped": {
      const typeValue = evaluate(env, checkType(ctx, equation.type))
      const leftValue = evaluate(env, check(ctx, equation.left, typeValue))
      const rightValue = evaluate(env, check(ctx, equation.right, typeValue))
      return solve(solution, ctx, typeValue, leftValue, rightValue)
    }

    case "EquationUntyped": {
      const leftInferred = infer(ctx, equation.left)
      const rightInferred = infer(ctx, equation.right)
      conversionType(ctx, leftInferred.type, rightInferred.type)
      const typeValue = leftInferred.type
      const leftValue = evaluate(env, leftInferred.core)
      const rightValue = evaluate(env, rightInferred.core)
      solution = solve(solution, ctx, typeValue, leftValue, rightValue)
      return solution
    }
  }
}
