import { lookupTypeInCtx } from "../../ctx"
import { lookupValueInEnv } from "../../env"
import * as Errors from "../../errors"
import { Mod } from "../../mod"
import { Span } from "../../span"
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
      throw new Errors.ElaborationError(
        `I can not circular import: ${this.path}`,
        {
          span: this.span,
        },
      )
    }

    const importedMod = await mod.options.loader.load(url)
    for (const binding of this.bindings) {
      const type = lookupTypeInCtx(importedMod.ctx, binding.name)
      const value = lookupValueInEnv(importedMod.env, binding.name)
      if (type === undefined || value === undefined) {
        throw new Errors.ElaborationError(
          `I meet undefined name: ${binding.name}, when importing module: ${this.path}`,
          {
            span: this.span,
          },
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
