import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxFulfilled } from "../ctx"
import { ElaborationError } from "../errors"
import * as Globals from "../globals"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, assertTypeInCtx, inclusion, Value } from "../value"
import * as Exps from "./Exp"
import { Exp } from "./Exp"
import { infer } from "./infer"

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
      assertTypeInCtx(ctx, type, Values.Pi)
      const { argType, retTypeClosure } = type
      const argValue = Values.TypedNeutral(argType, Neutrals.Var(exp.name))
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
      return checkByInfer(ctx, exp, type)
    }

    case "Car":
    case "Cdr": {
      return checkByInfer(ctx, exp, type)
    }

    default:
      throw new ElaborationError(
        `check is not implemented for exp: ${exp.kind}`
      )
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
      throw new ElaborationError(
        `simplifyMultiFn is not implemented for exp: ${binding.kind}`
      )
    }
  }
}
