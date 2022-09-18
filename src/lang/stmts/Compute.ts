import { evaluate } from "../core"
import { ctxToEnv } from "../ctx"
import { Exp, infer, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt, StmtOutput } from "../stmt"
import { formatTypedValue, TypedValue } from "../value"

export class Compute extends Stmt {
  constructor(public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<StmtOutput> {
    const inferred = infer(mod.solution, mod.ctx, this.exp)
    const value = evaluate(ctxToEnv(mod.ctx), inferred.core)
    return formatTypedValue(mod.ctx, TypedValue(inferred.type, value))
  }
}
