import { checkType } from "../../check"
import { CtxFulfilled, ctxToEnv } from "../../ctx"
import * as Errors from "../../errors"
import { evaluate } from "../../evaluate"
import type { Mod } from "../../mod"
import { formatSolution } from "../../solution"
import type { Span } from "../../span"
import { Stmt } from "../../stmt"
import * as Values from "../../value"

import { Equation, SolveBinding, unifyEquation } from "../solve"

export class Solve extends Stmt {
  constructor(
    public bindings: Array<SolveBinding>,
    public equations: Array<Equation>,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<string> {
    let ctx = mod.ctx
    const names: Array<string> = []
    for (const binding of this.bindings) {
      const typeCore = checkType(mod, ctx, binding.type)
      const type = evaluate(ctxToEnv(ctx), typeCore)
      const patternVar = Values.PatternVar(type, binding.name)
      ctx = CtxFulfilled(binding.name, type, patternVar, ctx)
      names.push(binding.name)
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
