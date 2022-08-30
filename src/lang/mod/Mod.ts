import { Ctx, CtxNull } from "../ctx"
import { Env, EnvNull } from "../env"
import { parseStmts } from "../parse"
import { globals } from "./globals"

export class Mod {
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()

  constructor() {
    globals.mount(this)
  }

  async run(code: string): Promise<void> {
    const stmts = parseStmts(code)
    for (const stmt of stmts) {
      await stmt.execute(this)
    }
  }
}
