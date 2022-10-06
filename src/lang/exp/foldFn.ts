import * as Exps from "../exp"
import { Exp } from "../exp"

export function foldFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(binding.name, foldFn(restBindings, ret))
    }

    case "FnBindingAnnotated": {
      return Exps.FnAnnotated(binding.name, binding.type, foldFn(restBindings, ret))
    }

    case "FnBindingImplicit": {
      return Exps.FnImplicit(binding.name, foldFn(restBindings, ret))
    }

    case "FnBindingAnnotatedImplicit": {
      return Exps.FnImplicitAnnotated(
        binding.name,
        binding.type,
        foldFn(restBindings, ret),
      )
    }
  }
}
