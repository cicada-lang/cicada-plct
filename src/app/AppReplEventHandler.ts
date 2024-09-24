import {
  type ReplEvent,
  ReplEventHandler,
} from "@cicada-lang/framework/lib/repl/index.js"
import fs from "fs"
import process from "process"
import * as Errors from "../lang/errors/index.js"
import { parseStmts } from "../lang/syntax/index.js"
import { Loader } from "../loader/index.js"
import { colors } from "../utils/colors.js"

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
    console.log(`Welcome to cicada`)
  }

  async handle(event: ReplEvent): Promise<void> {
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
    } catch (error) {
      console.log(error)
      if (!(error instanceof Error)) {
        console.error(error)
      } else if (error instanceof Errors.ElaborationError) {
        console.error(error.report(text))
      } else {
        console.error(error.message)
      }
    }
  }
}
