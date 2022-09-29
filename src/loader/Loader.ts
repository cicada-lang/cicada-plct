import pt from "@cicada-lang/partech"
import { Fetcher } from "../framework/fetcher"
import * as Errors from "../lang/errors"
import { Mod } from "../lang/mod"
import { parseStmts } from "../lang/parse"

export class Loader {
  cache: Map<string, Mod> = new Map()
  fetcher = new Fetcher()

  async load(url: URL): Promise<Mod> {
    const found = this.cache.get(url.href)
    if (found !== undefined) return found
    const code = await this.fetcher.fetch(url)

    try {
      const stmts = parseStmts(code)
      const mod = new Mod({ loader: this, url })
      await mod.executeStmts(stmts)
      this.cache.set(url.href, mod)
      return mod
    } catch (error) {
      if (error instanceof Errors.ElaborationError) {
        if (error.options?.span) {
          console.log(pt.report(error.options.span, code))
        }
      }

      throw error
    }
  }
}
