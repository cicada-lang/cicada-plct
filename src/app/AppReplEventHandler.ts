import fs from "fs"
import { ReplEvent, ReplEventHandler } from "../framework/repl"
import { LangError } from "../lang/errors"
import { Loader } from "../loader"
import { colors } from "../utils/colors"

export class AppReplEventHandler extends ReplEventHandler {
  loader = new Loader()

  constructor() {
    super()
    this.loader.fetcher.register("file", (url) =>
      fs.promises.readFile(url.pathname, "utf8"),
    )
    this.loader.fetcher.register("repl", (url) => "")
  }

  greeting(): void {
    console.log(`Welcome to Cicada ${app.config.pkg.version} *^-^*/`)
    console.log(`Type ".help" for more information`)
  }

  async handle(event: ReplEvent): Promise<boolean> {
    let { text } = event

    text = text.trim()
    const url = new URL("repl:")
    const mod = await this.loader.load(url)

    try {
      console.log(colors.blue(text))
      return true
    } catch (error) {
      if (!(error instanceof LangError)) throw error
      console.error(error.message)
      return false
    }
  }
}
