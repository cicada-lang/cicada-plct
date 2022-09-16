import { Ctx, CtxNull } from "../ctx"
import { Env, EnvNull } from "../env"
import { Stmt, StmtOutput } from "../stmt"
import { globals } from "./globals"

export class Mod {
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()
  outputs: Map<number, StmtOutput> = new Map()
  stmts: Array<Stmt> = []
  initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return
    await globals.mount(this)
  }

  async executeStmts(stmts: Array<Stmt>): Promise<Array<StmtOutput>> {
    await this.initialize()
    const outputs = []
    for (const [index, stmt] of stmts.entries()) {
      const output = await stmt.execute(this)
      this.stmts.push(stmt)
      if (output) {
        outputs.push(output)
        this.outputs.set(index, output)
      }
    }

    return outputs
  }
}
