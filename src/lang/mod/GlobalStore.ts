import { CtxFulfilled } from "../ctx"
import { EnvCons } from "../env"
import { Mod } from "../mod"
import { parseStmts } from "../parse"
import { Stmt } from "../stmt"
import { Value } from "../value"

type CodeEntry = {
  code: string
  stmts: Array<Stmt>
}

export class GlobalStore {
  typedValues: Map<string, { type: Value; value: Value }> = new Map()
  codeEntries: Array<CodeEntry> = []

  registerTypedValue(name: string, type: Value, value: Value): void {
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
      mod.env = EnvCons(name, value, mod.env)
    }
  }
}
