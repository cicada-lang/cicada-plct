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

  async watch(url: URL): Promise<void> {
    if (url.protocol !== "file:") {
      app.logger.info(`Can not watch non-local file.`)
      process.exit(1)
    }

    app.logger.info(`Initial run complete, now watching for changes.`)

    watcher(url.pathname, async (event, file) => {
      if (event === "remove") {
        this.loader.cache.delete(url.href)
        app.logger.info({ tag: event, msg: url.pathname })
        process.exit(1)
      }

      if (event === "update") {
        this.loader.cache.delete(url.href)
        const { error } = await this.run(url)
        if (error) {
          app.logger.error({ tag: event, msg: url.pathname })
        } else {
          app.logger.info({ tag: event, msg: url.pathname })
        }
      }
    })
  }
}
