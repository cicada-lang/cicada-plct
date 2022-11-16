import type { Mod } from "../../mod"
import type { Value } from "../../value"
import type { ImportBinding } from "../import"

export function defineBinding(
  mod: Mod,
  binding: ImportBinding,
  type: Value,
  value: Value,
): void {
  switch (binding.kind) {
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
