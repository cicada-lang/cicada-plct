import type { Exp } from "../exp/index.js"

export abstract class Macro {
  abstract expand(): Exp
}
