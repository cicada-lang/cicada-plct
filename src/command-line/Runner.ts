import fs from "fs"
import process from "node:process"
import * as Errors from "../lang/errors/index.js"
import { Loader } from "../loader/index.js"

export class Runner {
  loader = new Loader()

  constructor() {
    this.loader.fetcher.register("file", (url) => {
      if (process.platform === "win32") {
        return fs.readFileSync(url.pathname.slice(1), "utf8")
      } else {
        return fs.readFileSync(url.pathname, "utf8")
      }
    })
  }

  async run(
    url: URL,
    opts?: { silent?: boolean },
  ): Promise<{ error?: unknown }> {
    try {
      const mod = await this.loader.load(url)
      const outputs = Array.from(mod.outputs.values())
      const output = outputs.join("\n")
      if (!opts?.silent) {
        if (output) console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      if (!opts?.silent) {
        if (error instanceof Errors.ErrorReport) {
          console.error(error.message)
        } else {
          console.error(error)
        }
      }

      return { error }
    }
  }
}
