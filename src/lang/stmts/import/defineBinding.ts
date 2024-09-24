import type { Mod } from "../../mod/index.js"
import type { Value } from "../../value/index.js"
import type { ImportBinding } from "../import/index.js"

export function defineBinding(
  mod: Mod,
  binding: ImportBinding,
  type: Value,
  value: Value,
): void {
  switch (binding["@kind"]) {
    case "ImportBindingName": {
      mod.define(binding.name, type, value)
      return
    }

    case "ImportBindingAlias": {
      mod.define(binding.alias, type, value)
      return
    }
  }
}
