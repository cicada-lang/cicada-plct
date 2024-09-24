import { ctxLookupType } from "../../ctx/index.js"
import { envLookupValue } from "../../env/index.js"
import * as Errors from "../../errors/index.js"
import type { Mod } from "../../mod/index.js"
import type { Span } from "../../span/index.js"
import { Stmt } from "../../stmt/index.js"
import type { ImportBinding } from "../import/index.js"
import { defineBinding, undoBinding } from "../import/index.js"

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
      const type = ctxLookupType(importedMod.ctx, binding.name)
      const value = envLookupValue(importedMod.env, binding.name)
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

    mod.imported.push(url)
  }

  undo(mod: Mod): void {
    for (const binding of this.bindings) {
      undoBinding(mod, binding)
    }
  }
}
