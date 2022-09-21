import { Loader } from "../../loader"
import { Ctx, CtxFulfilled, CtxNull, deleteFirstFromCtx } from "../ctx"
import { deleteFirstFromEnv, Env, EnvCons, EnvNull } from "../env"
import { Solution } from "../solution"
import { Stmt, StmtOutput } from "../stmt"
import { Value } from "../value"
import { globals } from "./globals"

export interface ModOptions {
  loader: Loader
  url: URL
}

export class Mod {
  solution = new Solution()
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()
  outputs: Map<number, StmtOutput> = new Map()
  stmts: Array<Stmt> = []
  initialized = false

  constructor(public options: ModOptions) {}

  enrichCtx(ctx: Ctx): Env {
    return this.solution.enrichCtx(ctx)
  }

  resolve(href: string): URL {
    return new URL(href, this.options.url)
  }

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

  define(name: string, type: Value, value: Value): void {
    this.ctx = CtxFulfilled(name, type, value, this.ctx)
    this.env = EnvCons(name, value, this.env)
  }

  delete(name: string): void {
    this.ctx = deleteFirstFromCtx(this.ctx, name)
    this.env = deleteFirstFromEnv(this.env, name)
  }
}
