import { checkType } from "../../check"
import { CtxCons, ctxToEnv } from "../../ctx"
import * as Errors from "../../errors"
import { evaluate } from "../../evaluate"
import { Mod } from "../../mod"
import * as Neutrals from "../../neutral"
import {
  formatSolution,
  PatternVar,
  solutionAddPatternVar,
} from "../../solution"
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
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      const patternVar = PatternVar(typeValue, Neutrals.Var(name))
      solutionAddPatternVar(mod.solution, patternVar)
      ctx = CtxCons(name, typeValue, ctx)
      names.push(name)
    }

    for (const equation of this.equations) {
      try {
        unifyEquation(mod, ctx, equation)
      } catch (error) {
        if (error instanceof Errors.UnificationError) {
          throw new Errors.ElaborationError(
            [
              "[Solve.execute] meet UnificationError when unifying equation",
              ...error.trace,
              error.message,
            ].join("\n"),
            { span: equation.span },
          )
        }

        throw error
      }
    }

    return formatSolution(mod, ctx, mod.solution, names)
  }
}
