import { check, checkType } from "../../check"
import { evaluate } from "../../evaluate"
import type { Exp } from "../../exp"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt } from "../../stmt"

export class Check extends Stmt {
  constructor(public exp: Exp, public type: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod, mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    check(mod, mod.ctx, this.exp, typeValue)
  }
}
