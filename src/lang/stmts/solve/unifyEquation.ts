import { Mod } from "src/lang/mod"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, checkType, infer } from "../../exp"
import { unify } from "../../solution"
import { conversionType } from "../../value"
import { Equation } from "../solve"

export function unifyEquation(mod: Mod, ctx: Ctx, equation: Equation): void {
  switch (equation.kind) {
    case "EquationTyped": {
      const env = mod.ctxToEnv(ctx)
      const typeValue = evaluate(env, checkType(mod, ctx, equation.type))
      const leftValue = evaluate(env, check(mod, ctx, equation.left, typeValue))
      const rightValue = evaluate(
        env,
        check(mod, ctx, equation.right, typeValue),
      )
      unify(mod.solution, ctx, typeValue, leftValue, rightValue)
      return
    }

    case "EquationUntyped": {
      const leftInferred = infer(mod, ctx, equation.left)
      const rightInferred = infer(mod, ctx, equation.right)
      const leftType = mod.solution.deepWalk(mod, ctx, leftInferred.type)
      const rightType = mod.solution.deepWalk(mod, ctx, rightInferred.type)
      conversionType(mod, ctx, leftType, rightType)
      const typeValue = leftType
      const env = mod.ctxToEnv(ctx)
      const leftValue = evaluate(env, leftInferred.core)
      const rightValue = evaluate(env, rightInferred.core)
      unify(mod.solution, ctx, typeValue, leftValue, rightValue)
      return
    }
  }
}
