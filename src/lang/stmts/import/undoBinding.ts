import type { Mod } from "../../mod"
import type { ImportBinding } from "../import"

export function undoBinding(mod: Mod, binding: ImportBinding): void {
  switch (binding.kind) {
    case "ImportBindingName": {
      mod.delete(binding.name)
      return
    }

    case "ImportBindingAlias": {
      mod.delete(binding.alias)
      return
    }
  }
}
