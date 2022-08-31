import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function unfoldMultiPi(
  bindings: Array<Exps.PiBinding>,
  retType: Exp
): Exp {
  if (bindings.length === 0) return retType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "PiBindingNameless": {
      return Exps.Pi("_", binding.type, unfoldMultiPi(restBindings, retType))
    }

    case "PiBindingNamed": {
      return Exps.Pi(
        binding.name,
        binding.type,
        unfoldMultiPi(restBindings, retType)
      )
    }
  }
}
