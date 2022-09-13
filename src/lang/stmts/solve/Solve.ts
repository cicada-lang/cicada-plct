import { evaluate } from "../../core"
import { CtxCons, ctxToEnv } from "../../ctx"
import { checkType, Span } from "../../exp"
import { Mod } from "../../mod"
import { formatSolution, Solution, SolutionNull } from "../../solution"
import { Stmt, StmtOutput } from "../../stmt"
import { Equation, SolveBinding, solveEquation } from "../solve"

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
