import { Loader } from "../../loader/index.js"
import { check, checkType } from "../check/index.js"
import { CtxFulfilled } from "../ctx/index.js"
import { evaluate } from "../evaluate/index.js"
import { Mod } from "../mod/index.js"
import { parseExp } from "../syntax/index.js"
import type { Value } from "../value/index.js"

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
      const core = checkType(this.mod, this.mod.ctx, exp)
      this.claimed.set(name, evaluate(this.mod.env, core))
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
      const core = check(this.mod, this.mod.ctx, exp, type)
      value = evaluate(this.mod.env, core)
    }

    this.typedValues.set(name, { type, value })
    this.mod.define(name, type, value)
  }
}
