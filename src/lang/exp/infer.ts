import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, CtxFulfilled, ctxToEnv, lookupCtxType } from "../ctx"
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

    case "FoldedPi": {
      return infer(ctx, Exps.unfoldPi(exp.bindings, exp.retType))
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

    case "FoldedAp": {
      return infer(ctx, Exps.unfoldAp(exp.target, exp.args))
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

    case "FoldedSigma": {
      return infer(ctx, Exps.unfoldSigma(exp.bindings, exp.cdrType))
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

    case "Quote": {
      return Inferred(Values.String(), Cores.Quote(exp.literal))
    }

    case "ClazzNull": {
      return Inferred(Values.Type(), Cores.ClazzNull())
    }

    case "ClazzCons": {
      const propertyTypeCore = checkType(ctx, exp.propertyType)
      const propertyTypeValue = evaluate(ctxToEnv(ctx), propertyTypeCore)
      ctx = CtxCons(exp.name, propertyTypeValue, ctx)
      const restInfferd = infer(ctx, exp.rest)
      return Inferred(
        Values.Type(),
        Cores.ClazzCons(
          exp.name,
          exp.name,
          propertyTypeCore,
          restInfferd.core as Cores.Clazz
        )
      )
    }

    case "ClazzFulfilled": {
      const propertyTypeCore = checkType(ctx, exp.propertyType)
      const propertyTypeValue = evaluate(ctxToEnv(ctx), propertyTypeCore)
      const propertyCore = check(ctx, exp.property, propertyTypeValue)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxFulfilled(exp.name, propertyTypeValue, propertyValue, ctx)
      const restInfferd = infer(ctx, exp.rest)
      return Inferred(
        Values.Type(),
        Cores.ClazzFulfilled(
          exp.name,
          exp.name,
          propertyTypeCore,
          propertyCore,
          restInfferd.core as Cores.Clazz
        )
      )
    }

    case "FoldedClazz": {
      return infer(ctx, Exps.unfoldClazz(exp.bindings))
    }

    default: {
      throw new ElaborationError(`infer is not implemented for: ${exp.kind}`)
    }
  }
}
