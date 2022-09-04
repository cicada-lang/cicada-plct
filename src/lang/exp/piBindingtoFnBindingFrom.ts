import * as Exps from "../exp"

export function piBindingtoFnBindingFrom(
  binding: Exps.PiBinding,
): Exps.FnBinding {
  switch (binding.kind) {
    case "PiBindingNameless": {
      return Exps.FnBindingName("_")
    }

    case "PiBindingNamed": {
      return Exps.FnBindingName(binding.name)
    }
  }
}
