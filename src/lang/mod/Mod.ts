import { Loader } from "../../loader"
import { Ctx, CtxFulfilled, CtxNull, deleteFirstFromCtx } from "../ctx"
import { Env } from "../env"
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
  outputs: Map<number, StmtOutput> = new Map()
  stmts: Array<Stmt> = []
  initialized = false

  constructor(public options: ModOptions) {}

  ctxToEnv(ctx: Ctx): Env {
    return this.solution.enrichCtx(this, ctx)
  }

  get env(): Env {
    return this.ctxToEnv(this.ctx)
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
    const offset = this.stmts.length
    for (const [index, stmt] of stmts.entries()) {
      const output = await this.executeStmt(stmt)
      if (output) {
        this.outputs.set(offset + index, output)
        outputs.push(output)
      }
    }

    return outputs
  }

  private async executeStmt(stmt: Stmt): Promise<StmtOutput | undefined> {
    const output = await stmt.execute(this)
    this.stmts.push(stmt)
    this.solution.cleanup()
    return output || undefined
  }

  define(name: string, type: Value, value: Value): void {
    this.ctx = CtxFulfilled(name, type, value, this.ctx)
  }

  delete(name: string): void {
    this.ctx = deleteFirstFromCtx(this.ctx, name)
  }
}
