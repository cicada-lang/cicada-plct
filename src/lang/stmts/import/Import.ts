import { lookupTypeInCtx } from "../../ctx"
import { lookupValueInEnv } from "../../env"
import { ElaborationError } from "../../errors"
import { Span } from "../../exp"
import { Mod } from "../../mod"
import { Stmt } from "../../stmt"
import { defineBinding, ImportBinding, undoBinding } from "../import"

export class Import extends Stmt {
  constructor(
    public bindings: Array<ImportBinding>,
    public path: string,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const url = mod.resolve(this.path)
    if (url.href === mod.options.url.href) {
      throw new ElaborationError(`I can not circular import: ${this.path}`)
    }

    const importedMod = await mod.options.loader.loadAndRun(url)
    for (const binding of this.bindings) {
      const type = lookupTypeInCtx(importedMod.ctx, binding.name)
      const value = lookupValueInEnv(importedMod.env, binding.name)
      if (type === undefined || value === undefined) {
        throw new ElaborationError(
          `I meet undefined name: ${binding.name}, when importing module: ${this.path}`,
        )
      }

      defineBinding(mod, binding, type, value)
    }
  }

  undo(mod: Mod): void {
    for (const binding of this.bindings) {
      undoBinding(mod, binding)
    }
  }
}
