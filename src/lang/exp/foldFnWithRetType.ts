import * as Exps from "../exp"
import { Exp } from "../exp"

export function foldFnWithRetType(
  bindings: Array<Exps.FnBinding>,
  retType: Exp,
  ret: Exp,
): Exp {
  /**
     We implement the restriction of returnType by adding a `the` around the `ret`.
  **/

  if (bindings.length === 0) {
    return Exps.SequenceLetThe("_", retType, ret, Exps.Var("_"))
  }

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(
        binding.name,
        foldFnWithRetType(restBindings, retType, ret),
      )
    }

    case "FnBindingAnnotated": {
      return Exps.FnAnnotated(
        binding.name,
        binding.type,
        foldFnWithRetType(restBindings, retType, ret),
      )
    }

    case "FnBindingImplicit": {
      return Exps.FnImplicit(
        binding.name,
        foldFnWithRetType(restBindings, retType, ret),
      )
    }

    case "FnBindingAnnotatedImplicit": {
      return Exps.FnImplicitAnnotated(
        binding.name,
        binding.type,
        foldFnWithRetType(restBindings, retType, ret),
      )
    }
  }
}
