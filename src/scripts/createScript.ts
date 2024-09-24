import type { Mod } from "../lang/mod/index.js"
import type { Script } from "../script/index.js"
import * as Scripts from "../scripts/index.js"

export function createScript(mod: Mod, text: string): Script {
  if (mod.options.url.href.endsWith(".md")) {
    return new Scripts.MarkdownScript(mod, text)
  } else {
    return new Scripts.DefaultScript(mod, text)
  }
}
