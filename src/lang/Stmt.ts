import { Mod } from "./Mod"

export abstract class Stmt {
  abstract execute(mod: Mod): void
}
