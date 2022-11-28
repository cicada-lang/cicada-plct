import { ReplEvent, ReplEventHandler } from "@cicada-lang/framework/lib/repl"
import fs from "fs"
import process from "process"
import * as Errors from "../lang/errors"
import { parseStmts } from "../lang/syntax"
import { Loader } from "../loader"
import { colors } from "../utils/colors"

export class AppReplEventHandler extends ReplEventHandler {
  pathname = process.cwd() + "/repl"
  loader = new Loader()

  constructor() {
    super()
    this.loader.fetcher.register("file", (url) =>
      fs.promises.readFile(url.pathname, "utf8"),
    )
    this.loader.fetcher.register("repl", (url) => {
      return url.pathname === this.pathname
        ? ""
        : fs.promises.readFile(url.pathname, "utf8")
    })
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${app.config.pkg.version} *^-^*/`)
    console.log(`Type ".help" for more information`)
  }

  async handle(event: ReplEvent): Promise<boolean> {
    let { text } = event

    text = text.trim()

    const url = new URL(`repl://${this.pathname}`)
    const mod = await this.loader.load(url, { text: "" })

    try {
      const stmts = parseStmts(text)
      const outputs = await mod.executeStmts(stmts)
      for (const output of outputs) {
        console.log(colors.blue(output))
      }
      return true
    } catch (error) {
      console.log(error)
      if (!(error instanceof Error)) {
        console.error(error)
      } else if (error instanceof Errors.ElaborationError) {
        console.error(error.report(text))
      } else {
        console.error(error.message)
      }

      return false
    }
  }
}
