import { evaluate } from "../core"
import { Exp, infer, Span } from "../exp"
import { Mod } from "../mod"
import { deepWalk } from "../solution"
import { Stmt, StmtOutput } from "../stmt"
import { formatTypedValue, TypedValue } from "../value"

export class Compute extends Stmt {
  constructor(public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<StmtOutput> {
    const inferred = infer(mod.solution, mod.ctx, this.exp)
    const env = mod.solution.enrichEnv(mod.env)
    const value = evaluate(env, inferred.core)
    return formatTypedValue(
      mod.ctx,
      TypedValue(
        deepWalk(mod.solution, mod.ctx, inferred.type),
        deepWalk(mod.solution, mod.ctx, value),
      ),
    )
  }
}
