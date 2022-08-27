import { Core } from "./Core"
import { Ctx } from "./Ctx"
import * as Exps from "./Exp"
import { Exp } from "./Exp"
import * as Globals from "./globals"
import { inclusion } from "./inclusion"
import { infer } from "./infer"
import * as Values from "./Value"
import { assertValue, Value } from "./Value"

export function check(ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      return checkByInfer(ctx, exp, type)
    }

    case "Pi": {
      return checkByInfer(ctx, exp, type)
    }

    case "MultiPi": {
      return checkByInfer(ctx, exp, type)
    }

    case "MultiFn": {
      return check(ctx, simplifyMultiFn(exp.bindings, exp.ret), type)
    }

    case "Fn": {
      const pi = assertValue(ctx, type, Values.Pi)
      throw new Error("TODO")
    }

    case "Ap": {
      return checkByInfer(ctx, exp, type)
    }

    case "Sigma": {
      throw new Error("TODO")
    }

    case "Cons": {
      throw new Error("TODO")
    }

    case "Car": {
      return checkByInfer(ctx, exp, type)
    }

    case "Cdr": {
      return checkByInfer(ctx, exp, type)
    }

    default:
      throw new Error(`check is not implemented for exp: ${exp.kind}`)
  }
}

export function checkByInfer(ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(ctx, exp)
  inclusion(ctx, inferred.type, type)
  return inferred.core
}

export function checkType(ctx: Ctx, type: Exp): Core {
  return check(ctx, type, Globals.Type)
}

function simplifyMultiFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(binding.name, simplifyMultiFn(restBindings, ret))
    }

    case "FnBindingAnnotated": {
      throw new Error("TODO")
    }
  }
}
