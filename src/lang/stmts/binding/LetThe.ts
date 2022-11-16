import { check, checkType } from "../../check"
import { evaluate } from "../../evaluate"
import type { Exp } from "../../exp"
import type { Mod } from "../../mod"
import type { Span } from "../../span"
import { Stmt } from "../../stmt"

export class LetThe extends Stmt {
  constructor(
    public name: string,
    public type: Exp,
    public exp: Exp,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const typeCore = checkType(mod, mod.ctx, this.type)
    const type = evaluate(mod.env, typeCore)
    const core = check(mod, mod.ctx, this.exp, type)
    const value = evaluate(mod.env, core)
    mod.define(this.name, type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
