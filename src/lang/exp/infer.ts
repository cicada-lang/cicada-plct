import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, CtxFulfilled, ctxToEnv, lookupTypeInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check, checkClazz, checkType, Exp } from "../exp"
import * as Values from "../value"
import {
  applyClosure,
  assertClazzInCtx,
  assertTypeInCtx,
  lookupPropertyOrFail,
  lookupPropertyTypeOrFail,
  readback,
  Value,
} from "../value"

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
      const type = lookupTypeInCtx(ctx, exp.name)
      if (type !== undefined) {
        return Inferred(type, Cores.Var(exp.name))
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
        Cores.Pi(exp.name, argTypeCore, retTypeCore),
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
        Cores.Ap(inferred.core, argCore),
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
        Cores.Sigma(exp.name, carTypeCore, cdrTypeCore),
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
        Cores.Cdr(inferred.core),
      )
    }

    case "Quote": {
      return Inferred(Values.String(), Cores.Quote(exp.literal))
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return Inferred(Values.Type(), checkClazz(ctx, exp))
    }

    case "FoldedClazz": {
      return infer(ctx, Exps.unfoldClazz(exp.bindings))
    }

    case "Dot": {
      const inferred = infer(ctx, exp.target)
      const targetValue = evaluate(ctxToEnv(ctx), inferred.core)

      assertClazzInCtx(ctx, inferred.type)

      const propertyType = lookupPropertyTypeOrFail(
        inferred.type,
        targetValue,
        exp.name,
      )

      const property = lookupPropertyOrFail(
        inferred.type,
        targetValue,
        exp.name,
      )

      const propertyCore = readback(ctx, propertyType, property)

      return Inferred(propertyType, propertyCore)
    }

    case "Sequence": {
      return infer(ctx, Exps.unfoldSequence(exp.entries, exp.ret))
    }

    case "Let": {
      const inferred = infer(ctx, exp.exp)
      const value = evaluate(ctxToEnv(ctx), inferred.core)
      ctx = CtxFulfilled(exp.name, inferred.type, value, ctx)
      const retInferred = infer(ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Let(exp.name, inferred.core, retInferred.core),
      )
    }

    case "LetThe": {
      const typeCore = checkType(ctx, exp.type)
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      const core = check(ctx, exp.exp, typeValue)
      const value = evaluate(ctxToEnv(ctx), core)
      ctx = CtxFulfilled(exp.name, typeValue, value, ctx)
      const retInferred = infer(ctx, exp.ret)
      return Inferred(
        typeValue,
        Cores.LetThe(exp.name, typeCore, core, retInferred.core),
      )
    }

    case "Check": {
      const typeCore = checkType(ctx, exp.type)
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      const core = check(ctx, exp.exp, typeValue)
      const value = evaluate(ctxToEnv(ctx), core)
      const retInferred = infer(ctx, exp.ret)
      return Inferred(typeValue, Cores.Check(typeCore, core, retInferred.core))
    }

    default: {
      throw new ElaborationError(`infer is not implemented for: ${exp.kind}`)
    }
  }
}
