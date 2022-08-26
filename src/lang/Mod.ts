import { Ctx, CtxNull } from "./Ctx"
import { Env, EnvNull } from "./Env"
import { parseStmts } from "./parse"

export class Mod {
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()

  async run(code: string): Promise<void> {
    const stmts = parseStmts(code)
    for (const stmt of stmts) {
      await stmt.execute(this)
    }
  }
}
