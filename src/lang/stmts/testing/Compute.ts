import { evaluate } from "../../evaluate/index.js"
import type { Exp } from "../../exp/index.js"
import { infer } from "../../infer/index.js"
import type { Mod } from "../../mod/index.js"
import type { Span } from "../../span/index.js"
import { Stmt } from "../../stmt/index.js"
import { formatTypedValue, TypedValue } from "../../value/index.js"

export class Compute extends Stmt {
  constructor(
    public exp: Exp,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<string> {
    const inferred = infer(mod, mod.ctx, this.exp)
    const value = evaluate(mod.env, inferred.core)
    return formatTypedValue(mod, mod.ctx, TypedValue(inferred.type, value))
  }
}
