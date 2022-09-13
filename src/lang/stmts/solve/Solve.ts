import { evaluate } from "../../core"
import { Ctx, CtxCons, ctxToEnv } from "../../ctx"
import { check, checkType, Exp, infer, Span } from "../../exp"
import { Mod } from "../../mod"
import { formatSolution, Solution, SolutionNull, solve } from "../../solution"
import { Stmt, StmtOutput } from "../../stmt"
import { conversionType } from "../../value"
import { SolveBinding } from "../solve"

export type Equation = EquationTyped | EquationUntyped

export type EquationTyped = {
  kind: "EquationTyped"
  left: Exp
  right: Exp
  type: Exp
}

export function EquationTyped(left: Exp, right: Exp, type: Exp): EquationTyped {
  return {
    kind: "EquationTyped",
    left,
    right,
    type,
  }
}

export type EquationUntyped = {
  kind: "EquationUntyped"
  left: Exp
  right: Exp
}

export function EquationUntyped(left: Exp, right: Exp): EquationUntyped {
  return {
    kind: "EquationUntyped",
    left,
    right,
  }
}

export class Solve extends Stmt {
  constructor(
    public bindings: Array<SolveBinding>,
    public equations: Array<Equation>,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<StmtOutput> {
    let ctx = mod.ctx
    const names: Array<string> = []
    for (const { name, type } of this.bindings) {
      const typeValue = evaluate(ctxToEnv(ctx), checkType(ctx, type))
      ctx = CtxCons(name, typeValue, ctx)
      names.push(name)
    }

    let solution: Solution = SolutionNull()
    for (const equation of this.equations) {
      solution = solveEquation(solution, ctx, equation)
    }

    return formatSolution(solution, ctx, names)
  }
}

function solveEquation(
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
