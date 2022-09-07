import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function unfoldFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(binding.name, unfoldFn(restBindings, ret))
    }

    case "FnBindingAnnotated": {
      return Exps.AnnotatedFn(
        binding.name,
        binding.type,
        unfoldFn(restBindings, ret),
      )
    }
  }
}
