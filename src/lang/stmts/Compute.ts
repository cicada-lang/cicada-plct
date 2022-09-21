import { evaluate } from "../core"
import { Exp, infer, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt, StmtOutput } from "../stmt"
import { formatTypedValue, TypedValue } from "../value"

export class Compute extends Stmt {
  constructor(public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<StmtOutput> {
    const inferred = infer(mod, mod.ctx, this.exp)
    const value = evaluate(mod.env, inferred.core)
    return formatTypedValue(
      mod.ctx,
      TypedValue(
        mod.solution.deepWalk(mod.ctx, inferred.type),
        mod.solution.deepWalk(mod.ctx, value),
      ),
    )
  }
}
