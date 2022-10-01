import { Mod } from "../lang/mod"
import { Script } from "./Script"
import * as Scripts from "./scripts"

export function createScript(mod: Mod, text: string): Script {
  return new Scripts.PlainScript(mod, text)
}
