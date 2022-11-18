import type { Mod } from "src/lang/mod"
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
      const type = evaluate(env, checkType(mod, ctx, equation.type))
      const left = evaluate(env, check(mod, ctx, equation.left, type))
      const right = evaluate(env, check(mod, ctx, equation.right, type))
      unify(mod, ctx, type, left, right)
      return
    }

    case "EquationUnify": {
      const leftInferred = inferOrUndefined(mod, ctx, equation.left)
      const rightInferred = inferOrUndefined(mod, ctx, equation.right)

      if (leftInferred !== undefined && rightInferred !== undefined) {
        const leftType = leftInferred.type
        const rightType = rightInferred.type
        unifyType(mod, ctx, leftType, rightType)
        const type = leftType
        const env = ctxToEnv(ctx)
        const left = evaluate(env, leftInferred.core)
        const right = evaluate(env, rightInferred.core)
        unify(mod, ctx, type, left, right)
        return
      }

      if (leftInferred !== undefined) {
        const type = leftInferred.type
        const env = ctxToEnv(ctx)
        const left = evaluate(env, leftInferred.core)
        const rightCore = check(mod, ctx, equation.right, type)
        const right = evaluate(env, rightCore)
        unify(mod, ctx, type, left, right)
        return
      }

      if (rightInferred !== undefined) {
        const type = rightInferred.type
        const env = ctxToEnv(ctx)
        const leftCore = check(mod, ctx, equation.left, type)
        const left = evaluate(env, leftCore)
        const right = evaluate(env, rightInferred.core)
        unify(mod, ctx, type, left, right)
        return
      }

      // NOTE Let the `infer` error
      infer(mod, ctx, equation.left)
      infer(mod, ctx, equation.right)
      return
    }
  }
}
