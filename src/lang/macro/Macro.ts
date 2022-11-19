import type { Exp } from "../exp"

export abstract class Macro {
  abstract expand(): Exp
}
