import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import { infer } from "../../infer"
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
    const value = evaluate(mod.env, inferred.core)
    return formatTypedValue(
      mod,
      mod.ctx,
      mod.solution,
      TypedValue(inferred.type, value),
    )
  }
}
