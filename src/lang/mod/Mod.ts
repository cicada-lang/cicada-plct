import { Loader } from "../../loader"
import { Ctx, ctxDeleteFirst, CtxFulfilled, CtxNull } from "../ctx"
import { Env } from "../env"
import { useGlobals } from "../globals"
import { Solution } from "../solution"
import { Stmt, StmtOutput } from "../stmt"
import { Value } from "../value"

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
  imported: Array<URL> = []

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
    const globals = useGlobals()
    await globals.mount(this)
    this.initialized = true
  }

  async executeStmts(stmts: Array<Stmt>): Promise<Array<StmtOutput>> {
    await this.initialize()
    const outputs = []
    const offset = this.stmts.length
    for (const [index, stmt] of stmts.entries()) {
      const output = await stmt.execute(this)
      this.stmts.push(stmt)
      this.solution.cleanup()
      if (output) {
        this.outputs.set(offset + index, output)
        outputs.push(output)
      }
    }

    return outputs
  }

  define(name: string, type: Value, value: Value): void {
    this.ctx = CtxFulfilled(name, type, value, this.ctx)
  }

  delete(name: string): void {
    this.ctx = ctxDeleteFirst(this.ctx, name)
  }
}
