import { evaluate } from "../core"
import { checkType, enrichOrCheck, Exp, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

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
    const typeCore = checkType(mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    const enriched = enrichOrCheck(mod.ctx, this.exp, typeValue)
    const value = evaluate(mod.env, enriched.core)
    mod.define(this.name, enriched.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
