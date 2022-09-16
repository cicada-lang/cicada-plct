import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldFnWithRetType(
  bindings: Array<Exps.FnBinding>,
  retType: Exp,
  ret: Exp,
): Exp {
  // We implement the restriction of returnType by adding a `the` around returnExpr
  if (bindings.length === 0) {
    let the: Exp = Exps.Fn(
      "retType",
      Exps.AnnotatedFn("ret", Exps.Var("retType"), Exps.Var("ret")),
    )
    return Exps.Ap(Exps.Ap(the, retType), ret)
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
        binding.type,
        unfoldFnWithRetType(restBindings, retType, ret),
      )
    }
  }
}
