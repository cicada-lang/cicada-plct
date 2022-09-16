import { Ctx, CtxNull } from "../ctx"
import { Env, EnvNull } from "../env"
import { Stmt, StmtOutput } from "../stmt"
import { globals } from "./globals"

export interface ModOptions {
  stmts: Array<Stmt>
}

export class Mod {
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()
  outputs: Map<number, StmtOutput> = new Map()
  initialized = false

  constructor(public options: ModOptions) {}

  async initialize(): Promise<void> {
    if (this.initialized) return
    await globals.mount(this)
  }

  async run(): Promise<void> {
    await this.initialize()

    for (const [index, stmt] of this.options.stmts.entries()) {
      const output = await stmt.execute(this)
      if (output) {
        this.outputs.set(index, output)
      }
    }
  }
}
