import { evaluate } from "../core"
import { CtxFulfilled } from "../ctx"
import { EnvCons } from "../env"
import * as Exps from "../exp"
import { infer, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

export class Clazz extends Stmt {
  constructor(
    public name: string,
    public clazz: Exps.FoldedClazz,
    public span?: Span
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod.ctx, this.clazz)
    const value = evaluate(mod.env, inferred.core)
    mod.ctx = CtxFulfilled(this.name, inferred.type, value, mod.ctx)
    mod.env = EnvCons(this.name, value, mod.env)
  }
}
