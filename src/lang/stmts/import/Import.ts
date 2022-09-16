import { Span } from "../../exp"
import { Mod } from "../../mod"
import { Stmt } from "../../stmt"
import { ImportBinding, undoBinding } from "../import"

export class Import extends Stmt {
  constructor(
    public path: string,
    public bindings: Array<ImportBinding>,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    //
  }

  undo(mod: Mod): void {
    for (const binding of this.bindings) {
      undoBinding(mod, binding)
    }
  }
}
