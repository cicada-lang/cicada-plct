import { evaluate } from "../core"
import { check, checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

export class Check extends Stmt {
  constructor(public exp: Exp, public type: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    check(mod.ctx, this.exp, typeValue)
  }
}
