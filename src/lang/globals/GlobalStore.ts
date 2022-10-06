import { Loader } from "../../loader"
import * as Cores from "../core"
import { CtxFulfilled } from "../ctx"
import * as Exps from "../exp"
import { Mod } from "../mod"
import { parseExp, parseStmts } from "../parse"
import { Stmt } from "../stmt"
import { Value } from "../value"

type CodeEntry = {
  code: string
  stmts: Array<Stmt>
}

export class GlobalStore {
  claimed: Map<string, Value> = new Map()
  typedValues: Map<string, { type: Value; value: Value }> = new Map()
  codeEntries: Array<CodeEntry> = []
  mod: Mod

  constructor() {
    this.mod = new Mod({ loader: new Loader(), url: new URL("globals://") })
  }

  claim(name: string, type: Value | string): void {
    if (typeof type === "string") {
      const typeExp = parseExp(type)
      const typeCore = Exps.checkType(this.mod, this.mod.ctx, typeExp)
      const typeValue = Cores.evaluate(this.mod.env, typeCore)
      this.claimed.set(name, typeValue)
    } else {
      this.claimed.set(name, type)
    }
  }

  define(name: string, value: Value): void {
    const type = this.claimed.get(name)
    if (type === undefined) throw new Error(`unclaimed: ${name}`)
    this.typedValues.set(name, { type, value })
    this.mod.define(name, type, value)
  }

  registerCode(code: string): void {
    const stmts = parseStmts(code)
    this.codeEntries.push({ code, stmts })
  }

  async mount(mod: Mod): Promise<void> {
    await this.mountTypedValues(mod)
    await this.mountCode(mod)
  }

  async mountCode(mod: Mod): Promise<void> {
    for (const { stmts } of this.codeEntries) {
      for (const stmt of stmts) {
        const output = await stmt.execute(mod)
        if (output) {
          console.log({
            message: `[warning] registered code should not have output`,
            output,
          })
        }
      }
    }
  }

  async mountTypedValues(mod: Mod): Promise<void> {
    for (const [name, { type, value }] of this.typedValues.entries()) {
      mod.ctx = CtxFulfilled(name, type, value, mod.ctx)
    }
  }
}
