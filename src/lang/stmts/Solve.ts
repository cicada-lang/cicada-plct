import { evaluate } from "../core"
import { CtxCons, ctxToEnv } from "../ctx"
import { check, checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { formatSolution, Solution, SolutionNull, solve } from "../solution"
import { Stmt, StmtOutput } from "../stmt"

export type Equation = {
  left: Exp
  right: Exp
  type: Exp
}

export function Equation(left: Exp, right: Exp, type: Exp): Equation {
  return { left, right, type }
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
    for (const { left, right, type } of this.equations) {
      const typeValue = evaluate(env, checkType(ctx, type))
      const leftValue = evaluate(env, check(ctx, left, typeValue))
      const rightValue = evaluate(env, check(ctx, right, typeValue))
      solution = solve(solution, ctx, typeValue, leftValue, rightValue)
    }

    return formatSolution(solution, ctx, names)
  }
}
