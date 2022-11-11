import { checkType } from "../../check"
import { CtxCons } from "../../ctx"
import * as Errors from "../../errors"
import { evaluate } from "../../evaluate"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt, StmtOutput } from "../../stmt"
import { Equation, SolveBinding, unifyEquation } from "../solve"

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
      const typeValue = evaluate(mod.ctxToEnv(ctx), typeCore)
      mod.solution.createPatternVar(name, typeValue)
      ctx = CtxCons(name, typeValue, ctx)
      names.push(name)
    }

    for (const equation of this.equations) {
      try {
        unifyEquation(mod, ctx, equation)
      } catch (error) {
        if (error instanceof Errors.UnificationError) {
          throw new Errors.ElaborationError(
            ["solve fail", ...error.trace, error.message].join("\n"),
            { span: equation.span },
          )
        }

        throw error
      }
    }

    return mod.solution.formatSolution(mod, ctx, names)
  }
}
