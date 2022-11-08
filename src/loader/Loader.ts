import { Fetcher } from "../framework/fetcher"
import { Mod } from "../lang/mod"
import { Script } from "../script"
import * as Scripts from "../scripts"

export class Loader {
  private cache: Map<string, Script> = new Map()
  fetcher = new Fetcher()

  async load(url: URL, options?: { text?: string }): Promise<Mod> {
    const found = this.cache.get(url.href)
    if (found !== undefined) return found.mod

    const text = options?.text || (await this.fetcher.fetch(url))
    const mod = new Mod({ loader: this, url })
    const script = Scripts.createScript(mod, text)
    await script.run()
    this.cache.set(url.href, script)
    return script.mod
  }

  delete(url: URL): void {
    this.cache.delete(url.href)
  }

  get loaded(): Array<URL> {
    return Array.from(this.cache.keys()).map((href) => new URL(href))
  }
}
