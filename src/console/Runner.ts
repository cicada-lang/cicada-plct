import fs from "fs"
import watcher from "node-watch"
import { Loader } from "../loader"

export class Runner {
  loader = new Loader()

  constructor() {
    this.loader.fetcher.register("file", (url) =>
      fs.promises.readFile(url.pathname, "utf8"),
    )
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
        if (error instanceof Error) console.error(error.message)
        else console.error(error)
      }

      return { error }
    }
  }

  async watch(main: URL): Promise<void> {
    app.logger.info({
      msg: `Watching for changes.`,
      tracked: this.loader.loaded,
    })

    for (const url of this.loader.loaded) {
      if (main.protocol !== "file:") continue

      watcher(url.pathname, async (event) => {
        if (event === "remove") {
          this.loader.delete(url)
          if (url.href === main.href) {
            app.logger.info({ tag: event, msg: url.pathname })
            app.logger.info({ msg: "The main file is removed." })
          } else {
            const { error } = await this.run(main)
            if (error) app.logger.error({ tag: event, msg: url.pathname })
            else app.logger.info({ tag: event, msg: url.pathname })
          }
        }

        if (event === "update") {
          this.loader.delete(url)
          const { error } = await this.run(main)
          if (error) app.logger.error({ tag: event, msg: url.pathname })
          else app.logger.info({ tag: event, msg: url.pathname })
        }
      })
    }
  }
}
