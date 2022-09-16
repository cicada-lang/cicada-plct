import { Mod } from "../lang/mod"
import { Loader } from "../loader"

export class ScriptLoader extends Loader {
  async loadAndRun(url: URL): Promise<Mod> {
    const mod = await this.load(url)
    await mod.run()
    return mod
  }
}
