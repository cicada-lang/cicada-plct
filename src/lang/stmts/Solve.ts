import { Exp, Span } from "../exp"
import { Mod } from "../mod"
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
    // TODO
  }
}
