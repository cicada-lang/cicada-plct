import type { Mod } from "../lang/mod"
import type { Script } from "../script"
import * as Scripts from "../scripts"

export function createScript(mod: Mod, text: string): Script {
  if (mod.options.url.href.endsWith(".md")) {
    return new Scripts.MarkdownScript(mod, text)
  } else {
    return new Scripts.DefaultScript(mod, text)
  }
}
