import type { Loader } from "../../loader/index.js"
import type { Ctx } from "../ctx/index.js"
import {
  ctxDeleteFirst,
  CtxFulfilled,
  CtxNull,
  ctxToEnv,
} from "../ctx/index.js"
import type { Env } from "../env/index.js"
import { useGlobals } from "../globals/index.js"
import { Solution, solutionCleanup } from "../solution/index.js"
import type { Stmt } from "../stmt/index.js"
import type { Value } from "../value/index.js"

export interface ModOptions {
  loader: Loader
  url: URL
}

export class Mod {
  private initialized = false
  solution = new Solution()
  ctx: Ctx = CtxNull()
  outputs: Map<number, string> = new Map()
  stmts: Array<Stmt> = []
  imported: Array<URL> = []

  constructor(public options: ModOptions) {}

  get env(): Env {
    return ctxToEnv(this.ctx)
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

  async executeStmts(stmts: Array<Stmt>): Promise<Array<string>> {
    await this.initialize()

    const outputs = []
    const offset = this.stmts.length
    for (const [index, stmt] of stmts.entries()) {
      const output = await stmt.execute(this)
      this.stmts.push(stmt)
      solutionCleanup(this.solution)

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
