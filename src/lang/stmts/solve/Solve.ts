import { checkType } from "../../check/index.js"
import { CtxFulfilled, ctxToEnv } from "../../ctx/index.js"
import * as Errors from "../../errors/index.js"
import { evaluate } from "../../evaluate/index.js"
import type { Mod } from "../../mod/index.js"
import { formatSolution } from "../../solution/index.js"
import type { Span } from "../../span/index.js"
import { Stmt } from "../../stmt/index.js"
import * as Values from "../../value/index.js"
import { type Equation, SolveBinding, unifyEquation } from "../solve/index.js"

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
