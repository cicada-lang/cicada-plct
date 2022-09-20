import { evaluate } from "../core"
import { Exp, infer, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"

export class Let extends Stmt {
  constructor(public name: string, public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod.solution, mod.ctx, this.exp)
    const env = mod.solution.enrichEnv(mod.env)
    const value = evaluate(env, inferred.core)
    mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
