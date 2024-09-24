import type { Mod } from "../../mod/index.js"
import type { ImportBinding } from "../import/index.js"

export function undoBinding(mod: Mod, binding: ImportBinding): void {
  switch (binding["@kind"]) {
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
