import { evaluate } from "../../evaluate"
import type { Exp } from "../../exp"
import { infer } from "../../infer"
import type { Mod } from "../../mod"
import type { Span } from "../../span"
import { Stmt } from "../../stmt"

export class Let extends Stmt {
  constructor(
    public name: string,
    public exp: Exp,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod, mod.ctx, this.exp)
    const value = evaluate(mod.env, inferred.core)
    mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
