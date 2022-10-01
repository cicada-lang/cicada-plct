import { Mod } from "../lang/mod"
import * as Scripts from "../scripts"
import { Script } from "./Script"

export function createScript(mod: Mod, text: string): Script {
  if (mod.options.url.href.endsWith(".md")) {
    return new Scripts.MarkdownScript(mod, text)
  } else {
    return new Scripts.DefaultScript(mod, text)
  }
}
