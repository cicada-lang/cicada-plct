import { CtxFulfilled } from "../ctx"
import { EnvCons } from "../env"
import { evaluate } from "../evaluate"
import { Exp } from "../Exp"
import { infer } from "../infer"
import { Mod } from "../Mod"
import { Span } from "../Span"
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
