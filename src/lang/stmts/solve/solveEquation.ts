import { Mod } from "src/lang/mod"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, checkType, infer } from "../../exp"
import { deepWalk, solve } from "../../solution"
import { conversionType } from "../../value"
import { Equation } from "../solve"

export function solveEquation(mod: Mod, ctx: Ctx, equation: Equation): void {
  switch (equation.kind) {
    case "EquationTyped": {
      const env = mod.solution.enrichCtx(ctx)
      const typeValue = evaluate(env, checkType(mod, ctx, equation.type))
      const leftValue = evaluate(env, check(mod, ctx, equation.left, typeValue))
      const rightValue = evaluate(
        env,
        check(mod, ctx, equation.right, typeValue),
      )
      solve(mod.solution, ctx, typeValue, leftValue, rightValue)
      return
    }

    case "EquationUntyped": {
      const leftInferred = infer(mod, ctx, equation.left)
      const rightInferred = infer(mod, ctx, equation.right)
      const leftType = deepWalk(mod.solution, ctx, leftInferred.type)
      const rightType = deepWalk(mod.solution, ctx, rightInferred.type)
      conversionType(ctx, leftType, rightType)
      const typeValue = leftType
      const env = mod.solution.enrichCtx(ctx)
      const leftValue = evaluate(env, leftInferred.core)
      const rightValue = evaluate(env, rightInferred.core)
      solve(mod.solution, ctx, typeValue, leftValue, rightValue)
      return
    }
  }
}
