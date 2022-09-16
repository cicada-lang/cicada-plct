import { Mod } from "../../mod"
import { ImportBinding } from "../import"

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
