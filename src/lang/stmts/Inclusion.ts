import { evaluate } from "../core"
import { checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"
import { inclusion } from "../value"

export class Inclusion extends Stmt {
  constructor(public exps: Array<Exp>, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const cores = this.exps.map((exp) => checkType(mod, mod.ctx, exp))
    const types = cores.map((core) => evaluate(mod.env, core))

    if (types.length === 0) return

    let left = types[0]
    for (const right of types.slice(1)) {
      inclusion(mod, mod.ctx, left, right)
      left = right
    }
  }
}
