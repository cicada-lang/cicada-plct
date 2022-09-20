import { evaluate } from "../../core"
import { CtxCons } from "../../ctx"
import { checkType, Span } from "../../exp"
import { Mod } from "../../mod"
import { formatSolution } from "../../solution"
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
      const env = mod.solution.enrichCtx(ctx)
      const typeCore = checkType(mod.solution, ctx, type)
      const typeValue = evaluate(env, typeCore)
      ctx = CtxCons(name, typeValue, ctx)
      names.push(name)
    }

    for (const equation of this.equations) {
      mod.solution = solveEquation(mod.solution, ctx, equation)
    }

    return formatSolution(mod.solution, ctx, names)
  }
}
