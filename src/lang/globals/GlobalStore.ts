import { CtxFulfilled } from "../ctx"
import { Mod } from "../mod"
import { parseStmts } from "../parse"
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

  claim(name: string, type: Value): void {
    this.claimed.set(name, type)
  }

  define(name: string, value: Value): void {
    const type = this.claimed.get(name)
    if (type === undefined) throw new Error(`unclaimed: ${name}`)
    this.typedValues.set(name, { type, value })
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
