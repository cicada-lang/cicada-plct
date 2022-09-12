import { Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

type Equation = {
  left: Exp
  right: Exp
  type: Exp
}

export class Solve extends Stmt {
  constructor(
    public vars: Array<[string, Exp]>,
    public equations: Array<Equation>,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    // TODO
  }
}
