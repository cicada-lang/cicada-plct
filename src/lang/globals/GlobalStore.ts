import { CtxFulfilled } from "../ctx"
import { EnvCons } from "../env"
import { Mod } from "../mod"
import { Value } from "../value"

export class GlobalStore {
  map: Map<string, { type: Value; value: Value }> = new Map()

  register(name: string, global: { type: Value; value: Value }): void {
    this.map.set(name, global)
  }

  mount(mod: Mod): void {
    for (const [name, { type, value }] of this.map.entries()) {
      mod.ctx = CtxFulfilled(name, type, value, mod.ctx)
      mod.env = EnvCons(name, value, mod.env)
    }
  }
}
