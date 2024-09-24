import * as Errors from "../lang/errors/index.js"
import type { Mod } from "../lang/mod/index.js"
import { parseStmts } from "../lang/syntax/index.js"
import { Script } from "../script/index.js"

export class DefaultScript extends Script {
  constructor(
    public mod: Mod,
    public text: string,
  ) {
    super()
  }

  async run(): Promise<void> {
    try {
      const stmts = parseStmts(this.text)
      await this.mod.executeStmts(stmts)
    } catch (error) {
      if (error instanceof Errors.ElaborationError) {
        throw new Errors.ErrorReport(error.report(this.text))
      }

      throw error
    }
  }
}
