import { evaluate } from "../core"
import { CtxCons, ctxToEnv } from "../ctx"
import { check, checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { formatSolution, Solution, SolutionNull, solve } from "../solution"
import { Stmt, StmtOutput } from "../stmt"

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

export type SolveBinding = {
  name: string
  type: Exp
}

export function SolveBinding(name: string, type: Exp): SolveBinding {
  return {
    name,
    type,
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

    const env = ctxToEnv(ctx)

    let solution: Solution = SolutionNull()
    for (const equation of this.equations) {
      switch (equation.kind) {
        case "EquationTyped": {
          const typeValue = evaluate(env, checkType(ctx, equation.type))
          const leftValue = evaluate(env, check(ctx, equation.left, typeValue))
          const rightValue = evaluate(
            env,
            check(ctx, equation.right, typeValue),
          )
          solution = solve(solution, ctx, typeValue, leftValue, rightValue)
          continue
        }

        case "EquationUntyped": {
          // const typeValue = evaluate(env, checkType(ctx, type))
          // const leftValue = evaluate(env, check(ctx, left, typeValue))
          // const rightValue = evaluate(env, check(ctx, right, typeValue))
          // solution = solve(solution, ctx, typeValue, leftValue, rightValue)
          continue
        }
      }
    }

    return formatSolution(solution, ctx, names)
  }
}
