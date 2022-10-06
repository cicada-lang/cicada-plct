import { Loader } from "../../loader"
import * as Cores from "../core"
import { CtxFulfilled } from "../ctx"
import * as Exps from "../exp"
import { Mod } from "../mod"
import { parseExp } from "../parse"
import { Value } from "../value"

export class GlobalStore {
  claimed: Map<string, Value> = new Map()
  typedValues: Map<string, { type: Value; value: Value }> = new Map()
  mod = new Mod({ loader: new Loader(), url: new URL("globals://") })

  async mount(mod: Mod): Promise<void> {
    for (const [name, { type, value }] of this.typedValues.entries()) {
      mod.ctx = CtxFulfilled(name, type, value, mod.ctx)
    }
  }

  claim(name: string, type: Value | string): void {
    if (typeof type === "string") {
      const exp = parseExp(type)
      const core = Exps.checkType(this.mod, this.mod.ctx, exp)
      this.claimed.set(name, Cores.evaluate(this.mod.env, core))
    } else {
      this.claimed.set(name, type)
    }
  }

  define(name: string, value: Value | string): void {
    const type = this.claimed.get(name)
    if (type === undefined) {
      throw new Error(`unclaimed: ${name}`)
    }

    if (typeof value === "string") {
      const exp = parseExp(value)
      const core = Exps.check(this.mod, this.mod.ctx, exp, type)
      value = Cores.evaluate(this.mod.env, core)
    }

    this.typedValues.set(name, { type, value })
    this.mod.define(name, type, value)
  }
}
