import { ElaborationError } from "../errors"
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
      throw new ElaborationError(
        `unfoldFn is not implemented for exp: ${binding.kind}`
      )
    }
  }
}
