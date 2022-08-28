import { applyClosure } from "./Closure"
import * as Cores from "./Core"
import { Core } from "./Core"
import { Ctx, CtxFulfilled } from "./Ctx"
import * as Exps from "./Exp"
import { Exp } from "./Exp"
import * as Globals from "./globals"
import { inclusion } from "./inclusion"
import { infer } from "./infer"
import * as Neutrals from "./Neutral"
import * as Values from "./Value"
import { assertValue, Value } from "./Value"

export function check(ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      return checkByInfer(ctx, exp, type)
    }

    case "Pi":
    case "MultiPi": {
      return checkByInfer(ctx, exp, type)
    }

    case "MultiFn": {
      return check(ctx, simplifyMultiFn(exp.bindings, exp.ret), type)
    }

    case "Fn": {
      const { argType, retTypeClosure } = assertValue(ctx, type, Values.Pi)
      const argValue = Values.NotYetValue(argType, Neutrals.Var(exp.name))
      const retTypeValue = applyClosure(retTypeClosure, argValue)
      ctx = CtxFulfilled(exp.name, argType, argValue, ctx)
      const retCore = check(ctx, exp.ret, retTypeValue)
      return Cores.Fn(exp.name, retCore)
    }

    case "Ap":
    case "MultiAp": {
      return checkByInfer(ctx, exp, type)
    }

    case "Sigma":
    case "MultiSigma": {
      return checkByInfer(ctx, exp, type)
    }

    case "Cons": {
      throw new Error("TODO")
    }

    case "Car":
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
