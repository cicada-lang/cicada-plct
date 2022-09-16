import { Span } from "../../exp"
import { Mod } from "../../mod"
import { Stmt } from "../../stmt"

export type ImportEntry = { name: string; alias?: string }

export class Import extends Stmt {
  constructor(
    public path: string,
    public entries: Array<ImportEntry>,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    //
  }

  undo(mod: Mod): void {
    for (const { name, alias } of this.entries) {
      mod.delete(alias || name)
    }
  }
}
