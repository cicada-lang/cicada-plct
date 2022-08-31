import { Ctx, CtxNull } from "../ctx"
import { Env, EnvNull } from "../env"
import { Stmt } from "../stmt"
import { globals } from "./globals"

export interface ModOptions {
  stmts: Array<Stmt>
}

export class Mod {
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()

  constructor(public options: ModOptions) {
    globals.mount(this)
  }

  async run(): Promise<void> {
    for (const stmt of this.options.stmts) {
      await stmt.execute(this)
    }
  }
}
