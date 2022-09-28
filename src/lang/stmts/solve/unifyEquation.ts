import { Mod } from "src/lang/mod"
import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, checkType, infer, inferOrUndefined } from "../../exp"
import { unify } from "../../solution"
import { conversionType } from "../../value"
import { Equation } from "../solve"

export function unifyEquation(mod: Mod, ctx: Ctx, equation: Equation): void {
  switch (equation.kind) {
    case "EquationUnifyTyped": {
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

    case "EquationUnify": {
      const leftInferred = inferOrUndefined(mod, ctx, equation.left)
      const rightInferred = inferOrUndefined(mod, ctx, equation.right)

      if (leftInferred !== undefined && rightInferred !== undefined) {
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

      if (leftInferred !== undefined) {
        const typeValue = mod.solution.deepWalk(mod, ctx, leftInferred.type)
        const env = mod.ctxToEnv(ctx)
        const leftValue = evaluate(env, leftInferred.core)
        const rightCore = check(mod, ctx, equation.right, typeValue)
        const rightValue = evaluate(env, rightCore)
        unify(mod.solution, ctx, typeValue, leftValue, rightValue)
        return
      }

      if (rightInferred !== undefined) {
        const typeValue = mod.solution.deepWalk(mod, ctx, rightInferred.type)
        const env = mod.ctxToEnv(ctx)
        const leftCore = check(mod, ctx, equation.left, typeValue)
        const leftValue = evaluate(env, leftCore)
        const rightValue = evaluate(env, rightInferred.core)
        unify(mod.solution, ctx, typeValue, leftValue, rightValue)
        return
      }

      // NOTE Let the `infer` error
      infer(mod, ctx, equation.left)
      infer(mod, ctx, equation.right)
      return
    }
  }
}
