import { Mod } from "../Mod"
import { Stmt } from "../Stmt"
import { Exp } from "../Exp"

export class Declare extends Stmt {
  constructor(public name: string, public type: Exp) {
    super()
  }
  declare(){}
  execute(mod: Mod): void {
    // mod.declare()  
    // TODO
  }
}
