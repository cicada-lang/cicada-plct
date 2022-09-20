import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(binding.name, unfoldFn(restBindings, ret))
    }

    case "FnBindingAnnotated": {
      return Exps.FnAnnotated(
        binding.name,
        binding.type,
        unfoldFn(restBindings, ret),
      )
    }

    case "FnBindingImplicit": {
      return Exps.ImplicitFn(binding.name, unfoldFn(restBindings, ret))
    }

    case "FnBindingAnnotatedImplicit": {
      return Exps.AnnotatedImplicitFn(
        binding.name,
        binding.type,
        unfoldFn(restBindings, ret),
      )
    }
  }
}
