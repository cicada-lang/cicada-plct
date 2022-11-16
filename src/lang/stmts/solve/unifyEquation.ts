import { Mod } from "src/lang/mod"
import { check, checkType } from "../../check"
import type { Ctx } from "../../ctx"
import { ctxToEnv } from "../../ctx"
import { evaluate } from "../../evaluate"
import { infer, inferOrUndefined } from "../../infer"
import { unify, unifyType } from "../../unify"
import type { Equation } from "../solve"

export function unifyEquation(mod: Mod, ctx: Ctx, equation: Equation): void {
  switch (equation.kind) {
    case "EquationUnifyTyped": {
      const env = ctxToEnv(ctx)
      const typeValue = evaluate(env, checkType(mod, ctx, equation.type))
      const leftValue = evaluate(env, check(mod, ctx, equation.left, typeValue))
      const rightValue = evaluate(
        env,
        check(mod, ctx, equation.right, typeValue),
      )
      unify(mod, ctx, typeValue, leftValue, rightValue)
      return
    }

    case "EquationUnify": {
      const leftInferred = inferOrUndefined(mod, ctx, equation.left)
      const rightInferred = inferOrUndefined(mod, ctx, equation.right)

      if (leftInferred !== undefined && rightInferred !== undefined) {
        const leftType = leftInferred.type
        const rightType = rightInferred.type
        unifyType(mod, ctx, leftType, rightType)
        const typeValue = leftType
        const env = ctxToEnv(ctx)
        const leftValue = evaluate(env, leftInferred.core)
        const rightValue = evaluate(env, rightInferred.core)
        unify(mod, ctx, typeValue, leftValue, rightValue)
        return
      }

      if (leftInferred !== undefined) {
        const typeValue = leftInferred.type
        const env = ctxToEnv(ctx)
        const leftValue = evaluate(env, leftInferred.core)
        const rightCore = check(mod, ctx, equation.right, typeValue)
        const rightValue = evaluate(env, rightCore)
        unify(mod, ctx, typeValue, leftValue, rightValue)
        return
      }

      if (rightInferred !== undefined) {
        const typeValue = rightInferred.type
        const env = ctxToEnv(ctx)
        const leftCore = check(mod, ctx, equation.left, typeValue)
        const leftValue = evaluate(env, leftCore)
        const rightValue = evaluate(env, rightInferred.core)
        unify(mod, ctx, typeValue, leftValue, rightValue)
        return
      }

      // NOTE Let the `infer` error
      infer(mod, ctx, equation.left)
      infer(mod, ctx, equation.right)
      return
    }
  }
}
