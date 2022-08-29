import { checkType } from "../check"
import { CtxCons } from "../ctx"
import { evaluate } from "../evaluate"
import { Exp } from "../Exp"
import { Mod } from "../Mod"
import { Span } from "../Span"
import { Stmt } from "../Stmt"

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
