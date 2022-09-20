import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldPi(bindings: Array<Exps.PiBinding>, retType: Exp): Exp {
  if (bindings.length === 0) return retType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "PiBindingNameless": {
      return Exps.Pi("_", binding.type, unfoldPi(restBindings, retType))
    }

    case "PiBindingNamed": {
      return Exps.Pi(
        binding.name,
        binding.type,
        unfoldPi(restBindings, retType),
      )
    }

    case "PiBindingImplicit": {
      return Exps.PiImplicit(
        binding.name,
        binding.type,
        unfoldPi(restBindings, retType),
      )
    }
  }
}
