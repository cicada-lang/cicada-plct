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
    const typeCore = checkType(mod.solution, mod.ctx, this.type)
    const env = mod.solution.enrichEnv(mod.env)
    const typeValue = evaluate(env, typeCore)
    const enriched = enrichOrCheck(mod.solution, mod.ctx, this.exp, typeValue)
    const value = evaluate(env, enriched.core)
    mod.define(this.name, enriched.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
