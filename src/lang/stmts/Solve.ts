import { evaluate } from "../core"
import { CtxCons } from "../ctx"
import { check, checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Solution, SolutionNull, solve } from "../solution"
import { Stmt } from "../stmt"

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

  async execute(mod: Mod): Promise<void> {
    let ctx = mod.ctx
    for (const { name, type } of this.bindings) {
      const typeValue = evaluate(mod.env, checkType(ctx, type))
      ctx = CtxCons(name, typeValue, ctx)
    }

    let solution: Solution = SolutionNull()
    for (const { left, right, type } of this.equations) {
      const typeValue = evaluate(mod.env, checkType(ctx, type))
      const leftValue = evaluate(mod.env, check(ctx, left, typeValue))
      const rightValue = evaluate(mod.env, check(ctx, right, typeValue))
      solution = solve(solution, ctx, typeValue, leftValue, rightValue)
    }

    console.log(solution)
  }
}
