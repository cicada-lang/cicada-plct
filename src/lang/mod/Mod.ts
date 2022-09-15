import { Ctx, CtxFulfilled, CtxNull, deleteFirstFromCtx } from "../ctx"
import { deleteFirstFromEnv, Env, EnvCons, EnvNull } from "../env"
import { Stmt, StmtOutput } from "../stmt"
import { Value } from "../value"
import { globals } from "./globals"

export interface ModOptions {
  stmts: Array<Stmt>
}

export class Mod {
  ctx: Ctx = CtxNull()
  env: Env = EnvNull()
  outputs: Map<number, StmtOutput> = new Map()

  constructor(public options: ModOptions) {}

  async run(): Promise<void> {
    await globals.mount(this)

    for (const [index, stmt] of this.options.stmts.entries()) {
      const output = await stmt.execute(this)
      if (output) {
        this.outputs.set(index, output)
      }
    }
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
