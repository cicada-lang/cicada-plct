import { check, checkType } from "../../check/index.js"
import { evaluate } from "../../evaluate/index.js"
import type { Exp } from "../../exp/index.js"
import type { Mod } from "../../mod/index.js"
import type { Span } from "../../span/index.js"
import { Stmt } from "../../stmt/index.js"

export class Check extends Stmt {
  constructor(
    public exp: Exp,
    public type: Exp,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod, mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    check(mod, mod.ctx, this.exp, typeValue)
  }
}
