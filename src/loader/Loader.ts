import { Fetcher } from "../framework/fetcher"
import * as Errors from "../lang/errors"
import { Mod } from "../lang/mod"
import { parseStmts } from "../lang/parse"

export class Loader {
  cache: Map<string, Mod> = new Map()
  fetcher = new Fetcher()

  async load(url: URL, options?: { text?: string }): Promise<Mod> {
    const found = this.cache.get(url.href)
    if (found !== undefined) return found
    const text = options?.text || (await this.fetcher.fetch(url))

    try {
      const stmts = parseStmts(text)
      const mod = new Mod({ loader: this, url })
      await mod.executeStmts(stmts)
      this.cache.set(url.href, mod)
      return mod
    } catch (error) {
      if (error instanceof Errors.ElaborationError) {
        throw new Errors.ErrorReport(error.report({ text }))
      }

      throw error
    }
  }
}
