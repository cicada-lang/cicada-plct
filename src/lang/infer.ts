import { checkType } from "./check"
import * as Cores from "./Core"
import { Core } from "./Core"
import { Ctx, CtxCons, ctxToEnv, lookupCtxType } from "./Ctx"
import { ElaborationError } from "./errors/ElaborationError"
import { evaluate } from "./evaluate"
import * as Exps from "./Exp"
import { Exp } from "./Exp"
import * as Globals from "./globals"
import { globals } from "./globals"
import { Value } from "./Value"

export type Inferred = {
  type: Value
  core: Core
}

export function Inferred(type: Value, core: Core): Inferred {
  return {
    type,
    core,
  }
}

export function infer(ctx: Ctx, exp: Exp): Inferred {
  switch (exp.kind) {
    case "Var": {
      const foundType = lookupCtxType(ctx, exp.name)
      if (foundType !== undefined) {
        return Inferred(foundType, Cores.Var(exp.name))
      }

      const globalValue = globals.lookupValue(exp.name)
      if (globalValue !== undefined) {
        return Inferred(globalValue.type, Cores.Global(exp.name))
      }

      throw new ElaborationError(`Undefined name ${exp.name}`)
    }

    case "Pi": {
      const argTypeCore = checkType(ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = checkType(ctx, exp.retType)
      return Inferred(
        Globals.Type,
        Cores.Pi(exp.name, argTypeCore, retTypeCore)
      )
    }

    case "MultiPi": {
      return infer(ctx, simplifyMultiPi(exp.bindings, exp.retType))
    }

    // case "Ap": {
    //   const inferred = infer(ctx, exp.target)
    //   const pi = assertValue(ctx, inferred.type, Values.Pi)
    //   const argCore = check(ctx, exp.arg, pi.argType)
    //   const argValue = evaluate(ctxToEnv(ctx), argCore)
    //   return Inferred(
    //     applyClosure(pi.retTypeClosure, argValue),
    //     Cores.Ap(inferred.core, argCore)
    //   )
    // }

    default: {
      throw new Error(`infer is not implemented for: ${exp.kind}`)
    }
  }
}

function simplifyMultiPi(bindings: Array<Exps.PiBinding>, retType: Exp): Exp {
  if (bindings.length === 0) return retType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "PiBindingNameless": {
      return Exps.Pi("_", binding.type, simplifyMultiPi(restBindings, retType))
    }

    case "PiBindingNamed": {
      return Exps.Pi(
        binding.name,
        binding.type,
        simplifyMultiPi(restBindings, retType)
      )
    }
  }
}
