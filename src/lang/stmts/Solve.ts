import { Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

export type Equation = {
  left: Exp
  right: Exp
  type: Exp
}

export type SolveBinding = {
  name: string
  type: Exp
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
