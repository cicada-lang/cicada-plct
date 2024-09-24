import type { Mod } from "../lang/mod/index.js"

export abstract class Script {
  abstract mod: Mod
  abstract run(): Promise<void>
}
