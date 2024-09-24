import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"
import { spanUnion } from "../span/index.js"

export function foldPi(bindings: Array<Exps.PiBinding>, retType: Exp): Exp {
  if (bindings.length === 0) return retType

  const [binding, ...restBindings] = bindings

  switch (binding["@kind"]) {
    case "PiBindingNameless": {
      return Exps.Pi(
        "_",
        binding.type,
        foldPi(restBindings, retType),
        spanUnion(binding.span, retType.span),
      )
    }

    case "PiBindingNamed": {
      return Exps.Pi(
        binding.name,
        binding.type,
        foldPi(restBindings, retType),
        spanUnion(binding.span, retType.span),
      )
    }

    case "PiBindingImplicit": {
      return Exps.PiImplicit(
        binding.name,
        binding.type,
        foldPi(restBindings, retType),
        spanUnion(binding.span, retType.span),
      )
    }
  }
}
