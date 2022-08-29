import { evaluate, formatCore } from "../core"
import { ctxToEnv } from "../ctx"
import { Exp, infer, Span } from "../exp"
import { Mod } from "../mod"
import { Stmt } from "../stmt"
import { readback, readbackType } from "../value"

export class Compute extends Stmt {
  constructor(public exp: Exp, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod.ctx, this.exp)
    const value = evaluate(ctxToEnv(mod.ctx), inferred.core)
    const core = readback(mod.ctx, inferred.type, value)
    const typeCore = readbackType(mod.ctx, inferred.type)

    console.log(`${formatCore(typeCore)}: ${formatCore(core)}`)
  }
}
