import pt from "@cicada-lang/partech"
import fs from "fs"
import { ReplEvent, ReplEventHandler } from "../framework/repl"
import * as Errors from "../lang/errors"
import { parseStmts } from "../lang/parse"
import { Loader } from "../loader"
import { colors } from "../utils/colors"

export class AppReplEventHandler extends ReplEventHandler {
  loader = new Loader()

  constructor() {
    super()
    this.loader.fetcher.register("file", (url) => fs.promises.readFile(url.pathname, "utf8"))
    this.loader.fetcher.register("repl", (url) =>
      url.pathname ? fs.promises.readFile("./" + url.pathname, "utf8") : "",
    )
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${app.config.pkg.version} *^-^*/`)
    console.log(`Type ".help" for more information`)
  }

  async handle(event: ReplEvent): Promise<boolean> {
    let { text } = event

    text = text.trim()

    const url = new URL("repl://")
    const mod = await this.loader.load(url)

    try {
      const stmts = parseStmts(text)
      const outputs = await mod.executeStmts(stmts)
      for (const output of outputs) {
        console.log(colors.blue(output))
      }
      return true
    } catch (error) {
      if (error instanceof Errors.ElaborationError) {
        if (error.options?.span) {
          console.log(pt.report(error.options.span, text))
        }
      }

      if (!(error instanceof Error)) throw error
      console.error(error.message)
      return false
    }
  }
}
