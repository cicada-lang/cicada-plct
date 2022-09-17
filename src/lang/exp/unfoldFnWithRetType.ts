import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldFnWithRetType(
  bindings: Array<Exps.FnBinding>,
  retType: Exp,
  ret: Exp,
): Exp {
  /**
     We implement the restriction of returnType by adding a `the` around the `ret`.
  **/

  if (bindings.length === 0) {
    let typedRet = Exps.SequenceLetThe("ret", retType, ret, Exps.Var("ret"))

    return typedRet
  }

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(
        binding.name,
        unfoldFnWithRetType(restBindings, retType, ret),
      )
    }

    case "FnBindingAnnotated": {
      return Exps.AnnotatedFn(
        binding.name,
        binding.type,
        unfoldFnWithRetType(restBindings, retType, ret),
      )
    }

    case "FnBindingImplicit": {
      return Exps.ImplicitFn(
        binding.name,
        unfoldFnWithRetType(restBindings, retType, ret),
      )
    }
  }
}
