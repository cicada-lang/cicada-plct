import { evaluate } from "../core"
import { CtxFulfilled } from "../ctx"
import { EnvCons } from "../env"
import { Exp, infer, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../Stmt"

export class Let extends Stmt {
  constructor(public name: string, public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const value = evaluate(mod.env, inferred.core)
    mod.ctx = CtxFulfilled(this.name, inferred.type, value, mod.ctx)
    mod.env = EnvCons(this.name, value, mod.env)
  }
}
