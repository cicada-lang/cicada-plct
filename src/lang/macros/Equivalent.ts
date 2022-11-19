import type { Exp } from "../exp"
import { Macro } from "../macro"

export type EquivalentEntry = {
  via?: Exp
  to: Exp
}

export class Equivalent extends Macro {
  constructor(
    public type: Exp,
    public from: Exp,
    public rest: Array<EquivalentEntry>,
  ) {
    super()
  }

  expand(): Exp {
    throw new Error("TODO")
  }
}
