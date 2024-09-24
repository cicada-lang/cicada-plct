import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"
import { spanUnion } from "../span/index.js"

export function foldFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding["@kind"]) {
    case "FnBindingName": {
      return Exps.Fn(
        binding.name,
        foldFn(restBindings, ret),
        spanUnion(binding.span, ret.span),
      )
    }

    case "FnBindingAnnotated": {
      return Exps.FnAnnotated(
        binding.name,
        binding.type,
        foldFn(restBindings, ret),
        spanUnion(binding.span, ret.span),
      )
    }

    case "FnBindingImplicit": {
      return Exps.FnImplicit(
        binding.name,
        foldFn(restBindings, ret),
        spanUnion(binding.span, ret.span),
      )
    }

    case "FnBindingAnnotatedImplicit": {
      return Exps.FnImplicitAnnotated(
        binding.name,
        binding.type,
        foldFn(restBindings, ret),
        spanUnion(binding.span, ret.span),
      )
    }
  }
}
