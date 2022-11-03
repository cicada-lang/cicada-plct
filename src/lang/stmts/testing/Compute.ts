import { evaluate } from "../../core"
import { Exp, infer } from "../../exp"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt, StmtOutput } from "../../stmt"
import { formatTypedValue, TypedValue } from "../../value"

export class Compute extends Stmt {
  constructor(public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<StmtOutput> {
    const inferred = infer(mod, mod.ctx, this.exp)
    let value = evaluate(mod.env, inferred.core)
    const type = mod.solution.deepWalkType(mod, mod.ctx, inferred.type)
    value = mod.solution.deepWalk(mod, mod.ctx, type, value)
    return formatTypedValue(mod, mod.ctx, TypedValue(type, value))
  }
}
