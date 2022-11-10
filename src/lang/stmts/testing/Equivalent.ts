import { evaluate } from "../../core"
import { check, checkType, Exp } from "../../exp"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt } from "../../stmt"
import { equivalent } from "../../value"

export class Equivalent extends Stmt {
  constructor(public type: Exp, public exps: Array<Exp>, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod, mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)

    const cores = this.exps.map((exp) => check(mod, mod.ctx, exp, typeValue))
    const values = cores.map((core) => evaluate(mod.env, core))

    if (values.length === 0) return

    let left = values[0]
    for (const right of values.slice(1)) {
      equivalent(mod, mod.ctx, typeValue, left, right)
      left = right
    }
  }
}
