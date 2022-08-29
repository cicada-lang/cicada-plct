import { evaluate } from "../core"
import { CtxFulfilled } from "../ctx"
import { EnvCons } from "../env"
import { check, checkType, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../Stmt"

export class LetThe extends Stmt {
  constructor(
    public name: string,
    public type: Exp,
    public exp: Exp,
    public span?: Span
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    const core = check(mod.ctx, this.exp, typeValue)
    const value = evaluate(mod.env, core)
    mod.ctx = CtxFulfilled(this.name, typeValue, value, mod.ctx)
    mod.env = EnvCons(this.name, typeValue, mod.env)
  }
}
