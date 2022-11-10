import { evaluate } from "../../evaluate"
import { checkType, Exp } from "../../exp"
import { include } from "../../include"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt } from "../../stmt"

export class Include extends Stmt {
  constructor(public exps: Array<Exp>, public span?: Span) {
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
