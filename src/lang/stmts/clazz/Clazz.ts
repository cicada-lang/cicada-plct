import { evaluate } from "../../evaluate/index.js"
import type * as Exps from "../../exp/index.js"
import { infer } from "../../infer/index.js"
import type { Mod } from "../../mod/index.js"
import type { Span } from "../../span/index.js"
import { Stmt } from "../../stmt/index.js"

export class Clazz extends Stmt {
  constructor(
    public name: string,
    public clazz: Exps.ClazzUnfolded,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod, mod.ctx, this.clazz)
    const value = evaluate(mod.env, inferred.core)
    mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
