import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv, lookupCtxType } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check, checkType, Exp } from "../exp"
import * as Values from "../value"
import { applyClosure, assertTypeInCtx, Value } from "../value"

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

      throw new ElaborationError(`Undefined name ${exp.name}`)
    }

    case "Pi": {
      const argTypeCore = checkType(ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = checkType(ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.Pi(exp.name, argTypeCore, retTypeCore)
      )
    }

    case "MultiPi": {
      return infer(ctx, Exps.foldMultiPi(exp.bindings, exp.retType))
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
      return infer(ctx, Exps.foldMultiAp(exp.target, exp.args))
    }

    case "Sigma": {
      const carTypeCore = checkType(ctx, exp.carType)
      const carTypeValue = evaluate(ctxToEnv(ctx), carTypeCore)
      ctx = CtxCons(exp.name, carTypeValue, ctx)
      const cdrTypeCore = checkType(ctx, exp.cdrType)
      return Inferred(
        Values.Type(),
        Cores.Sigma(exp.name, carTypeCore, cdrTypeCore)
      )
    }

    case "MultiSigma": {
      return infer(ctx, Exps.foldMultiSigma(exp.bindings, exp.cdrType))
    }

    case "Car": {
      const inferred = infer(ctx, exp.target)
      assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      return Inferred(inferred.type.carType, Cores.Car(inferred.core))
    }

    case "Cdr": {
      const inferred = infer(ctx, exp.target)
      assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      const carValue = evaluate(ctxToEnv(ctx), Cores.Car(inferred.core))
      return Inferred(
        applyClosure(sigma.cdrTypeClosure, carValue),
        Cores.Cdr(inferred.core)
      )
    }

    default: {
      throw new ElaborationError(`infer is not implemented for: ${exp.kind}`)
    }
  }
}