import { evaluate } from "../core"
import { CtxCons } from "../ctx"
import { checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

export class Declare extends Stmt {
  constructor(public name: string, public type: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    mod.ctx = CtxCons(this.name, typeValue, mod.ctx)
    // TODO Should we also extend `mod.env` here?
  }
}
