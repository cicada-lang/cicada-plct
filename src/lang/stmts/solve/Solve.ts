import { evaluate } from "../../core"
import { CtxCons } from "../../ctx"
import { checkType, Span } from "../../exp"
import { Mod } from "../../mod"
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
      const typeCore = checkType(mod, ctx, type)
      const typeValue = evaluate(mod.solution.enrichCtx(mod, ctx), typeCore)
      mod.solution.createPatternVar(name, typeValue)
      ctx = CtxCons(name, typeValue, ctx)
      names.push(name)
    }

    for (const equation of this.equations) {
      solveEquation(mod, ctx, equation)
    }

    return mod.solution.formatSolution(mod, ctx, names)
  }
}
