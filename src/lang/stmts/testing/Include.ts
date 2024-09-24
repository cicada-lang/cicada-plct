import { checkType } from "../../check/index.js"
import { evaluate } from "../../evaluate/index.js"
import type { Exp } from "../../exp/index.js"
import { include } from "../../include/index.js"
import type { Mod } from "../../mod/index.js"
import type { Span } from "../../span/index.js"
import { Stmt } from "../../stmt/index.js"

export class Include extends Stmt {
  constructor(
    public exps: Array<Exp>,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const cores = this.exps.map((exp) => checkType(mod, mod.ctx, exp))
    const types = cores.map((core) => evaluate(mod.env, core))

    if (types.length === 0) return

    let left = types[0]
    for (const right of types.slice(1)) {
      include(mod, mod.ctx, left, right)
      left = right
    }
  }
}
