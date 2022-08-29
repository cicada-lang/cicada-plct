import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv, lookupCtxType } from "../ctx"
import { ElaborationError } from "../errors"
import * as Globals from "../globals"
import { globals } from "../globals"
import * as Values from "../value"
import { applyClosure, assertTypeInCtx, Value } from "../value"
import { check, checkType } from "./check"
import * as Exps from "./Exp"
import { Exp } from "./Exp"

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

    case "Ap": {
      const inferred = infer(ctx, exp.target)
      assertTypeInCtx(ctx, inferred.type, Values.Pi)
      const pi = inferred.type
      const argCore = check(ctx, exp.arg, pi.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      return Inferred(
        applyClosure(pi.retTypeClosure, argValue),
        Cores.Ap(inferred.core, argCore)
      )
    }

    case "MultiAp": {
      return infer(ctx, simplifyMultiAp(exp.target, exp.args))
    }

    case "Sigma": {
      const carTypeCore = checkType(ctx, exp.carType)
      const carTypeValue = evaluate(ctxToEnv(ctx), carTypeCore)
      ctx = CtxCons(exp.name, carTypeValue, ctx)
      const cdrTypeCore = checkType(ctx, exp.cdrType)
      return Inferred(
        Globals.Type,
        Cores.Sigma(exp.name, carTypeCore, cdrTypeCore)
      )
    }

    case "MultiSigma": {
      return infer(ctx, simplifyMultiSigma(exp.bindings, exp.cdrType))
    }

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

function simplifyMultiAp(target: Exp, args: Array<Exps.Arg>): Exp {
  if (args.length === 0) return target

  const [arg, ...restArgs] = args

  switch (arg.kind) {
    case "ArgPlain": {
      return simplifyMultiAp(Exps.Ap(target, arg.exp), restArgs)
    }

    case "ArgImplicit": {
      throw new Error("TODO")
    }

    case "ArgVague": {
      throw new Error("TODO")
    }
  }
}

export function simplifyMultiSigma(
  bindings: Array<Exps.SigmaBinding>,
  cdrType: Exp
): Exp {
  if (bindings.length === 0) return cdrType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "SigmaBindingNameless": {
      return Exps.Sigma(
        "_",
        binding.type,
        simplifyMultiSigma(restBindings, cdrType)
      )
    }

    case "SigmaBindingNamed": {
      return Exps.Sigma(
        binding.name,
        binding.type,
        simplifyMultiSigma(restBindings, cdrType)
      )
    }
  }
}
