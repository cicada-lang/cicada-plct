import * as Exps from "../exp"
import { Exp } from "../exp"

export function foldSigma(bindings: Array<Exps.SigmaBinding>, cdrType: Exp): Exp {
  if (bindings.length === 0) return cdrType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "SigmaBindingNameless": {
      return Exps.Sigma("_", binding.type, foldSigma(restBindings, cdrType))
    }

    case "SigmaBindingNamed": {
      return Exps.Sigma(binding.name, binding.type, foldSigma(restBindings, cdrType))
    }
  }
}
