import { applyClosure, Closure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import {
  Ctx,
  CtxCons,
  CtxFulfilled,
  ctxToEnv,
  lookupTypeInCtx,
  lookupValueInCtx,
} from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import * as Values from "../value"
import { readback, readbackType, Value } from "../value"

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
      const argTypeCore = Exps.checkType(ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = Exps.checkType(ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.Pi(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "ImplicitPi": {
      const argTypeCore = Exps.checkType(ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = Exps.checkType(ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.ImplicitPi(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "FoldedPi": {
      return infer(ctx, Exps.unfoldPi(exp.bindings, exp.retType))
    }

    case "AnnotatedFn": {
      const argTypeCore = Exps.checkType(ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const inferredRet = infer(ctx, exp.ret)
      const retTypeCore = readbackType(ctx, inferredRet.type)
      const retTypeClosure = Closure(ctxToEnv(ctx), exp.name, retTypeCore)
      return Inferred(
        Values.Pi(argTypeValue, retTypeClosure),
        Cores.Fn(exp.name, inferredRet.core),
      )
    }

    case "FoldedFn": {
      return infer(ctx, Exps.unfoldFn(exp.bindings, exp.ret))
    }

    case "FoldedFnWithRetType": {
      return infer(
        ctx,
        Exps.unfoldFnWithRetType(exp.bindings, exp.retType, exp.ret),
      )
    }

    case "Ap": {
      {
        const folded = Exps.foldAp(exp)
        const inferred = infer(ctx, folded.target)
        /**
           `ImplicitAp` insertion.
        **/
        if (
          Values.isValue(inferred.type, Values.ImplicitPi) &&
          folded.args[0]?.kind !== "ArgImplicit"
        ) {
          return Exps.insertImplicitAp(
            ctx,
            inferred.core,
            inferred.type,
            folded.args,
          )
        }
      }

      const inferred = infer(ctx, exp.target)

      {
        /**
           Try to use `targetValue` first, then use `inferred.type`.
        **/
        const targetValue = evaluate(ctxToEnv(ctx), inferred.core)
        /**
           Fulfilling type.
        **/
        if (Values.isClazz(targetValue)) {
          const argCore = Exps.checkClazzArg(ctx, targetValue, exp.arg)
          return Inferred(Values.Type(), Cores.Ap(inferred.core, argCore))
        }
      }

      Values.assertTypeInCtx(ctx, inferred.type, Values.Pi)
      const argCore = Exps.check(ctx, exp.arg, inferred.type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.Ap(inferred.core, argCore),
      )
    }

    case "ImplicitAp": {
      const inferred = infer(ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.ImplicitPi)
      const argCore = Exps.check(ctx, exp.arg, inferred.type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.ImplicitAp(inferred.core, argCore),
      )
    }

    case "FoldedAp": {
      return infer(ctx, Exps.unfoldAp(exp.target, exp.args))
    }

    case "Sigma": {
      const carTypeCore = Exps.checkType(ctx, exp.carType)
      const carTypeValue = evaluate(ctxToEnv(ctx), carTypeCore)
      ctx = CtxCons(exp.name, carTypeValue, ctx)
      const cdrTypeCore = Exps.checkType(ctx, exp.cdrType)
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
      Values.assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      return Inferred(sigma.carType, Cores.Car(inferred.core))
    }

    case "Cdr": {
      const inferred = infer(ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      const carValue = evaluate(ctxToEnv(ctx), Cores.Car(inferred.core))
      return Inferred(
        applyClosure(sigma.cdrTypeClosure, carValue),
        Cores.Cdr(inferred.core),
      )
    }

    case "Cons": {
      const carInferred = infer(ctx, exp.car)
      const cdrInferred = infer(ctx, exp.cdr)
      const cdrTypeCore = readbackType(ctx, cdrInferred.type)
      const cdrTypeClosure = Closure(ctxToEnv(ctx), "_", cdrTypeCore)
      return Inferred(
        Values.Sigma(carInferred.type, cdrTypeClosure),
        Cores.Cons(carInferred.core, cdrInferred.core),
      )
    }

    case "Quote": {
      return Inferred(Values.String(), Cores.Quote(exp.literal))
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return Inferred(Values.Type(), Exps.checkClazz(ctx, exp))
    }

    case "FoldedClazz": {
      return infer(ctx, Exps.unfoldClazz(exp.bindings))
    }

    case "Objekt": {
      let clazz: Values.Clazz = Values.ClazzNull()
      let properties: Record<string, Core> = {}
      for (let [name, property] of Object.entries(exp.properties).reverse()) {
        const inferred = infer(ctx, property)
        const value = evaluate(ctxToEnv(ctx), inferred.core)
        clazz = Values.ClazzFulfilled(name, inferred.type, value, clazz)
        properties[name] = inferred.core
      }

      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "FoldedObjekt": {
      return infer(
        ctx,
        Exps.Objekt(Exps.prepareProperties(ctx, exp.properties)),
      )
    }

    case "Dot": {
      const inferred = infer(ctx, exp.target)
      const targetValue = evaluate(ctxToEnv(ctx), inferred.core)
      Values.assertClazzInCtx(ctx, inferred.type)
      const propertyType = Values.lookupPropertyTypeOrFail(
        inferred.type,
        targetValue,
        exp.name,
      )
      const property = Values.lookupPropertyOrFail(
        inferred.type,
        targetValue,
        exp.name,
      )
      const propertyCore = readback(ctx, propertyType, property)
      return Inferred(propertyType, propertyCore)
    }

    case "FoldedNew": {
      return infer(
        ctx,
        Exps.New(exp.name, Exps.prepareProperties(ctx, exp.properties)),
      )
    }

    case "New": {
      const clazz = lookupValueInCtx(ctx, exp.name)
      if (clazz === undefined) {
        throw new ElaborationError(`undefined class: ${exp.name}`)
      }

      Values.assertClazzInCtx(ctx, clazz)

      const properties = Exps.inferProperties(ctx, exp.properties, clazz)
      const names = Object.keys(properties)

      const extra = Exps.inferExtraProperties(ctx, exp.properties, names)

      /**
         We add the inferred `extra.clazz` to the return value,
         because the body of the `New` might have extra properties,
         thus more specific than the given type.
      **/

      return Inferred(
        Values.prependFulfilledClazz(extra.clazz, clazz),
        Cores.Objekt({ ...properties, ...extra.properties }),
      )
    }

    case "NewAp": {
      const clazz = lookupValueInCtx(ctx, exp.name)
      if (clazz === undefined) {
        throw new ElaborationError(`undefined class: ${exp.name}`)
      }

      Values.assertClazzInCtx(ctx, clazz)
      const properties = Exps.checkNewArgs(ctx, exp.args, clazz)
      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "FoldedSequence": {
      return infer(ctx, Exps.unfoldSequence(exp.bindings, exp.ret))
    }

    case "SequenceLet": {
      const inferred = infer(ctx, exp.exp)
      const value = evaluate(ctxToEnv(ctx), inferred.core)
      ctx = CtxFulfilled(exp.name, inferred.type, value, ctx)
      const retInferred = infer(ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), inferred.core),
      )
    }

    case "SequenceLetThe": {
      const typeCore = Exps.checkType(ctx, exp.type)
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      const enriched = Exps.enrichOrCheck(ctx, exp.exp, typeValue)
      const value = evaluate(ctxToEnv(ctx), enriched.core)
      ctx = CtxFulfilled(exp.name, enriched.type, value, ctx)
      const retInferred = infer(ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), enriched.core),
      )
    }

    case "SequenceCheck": {
      const typeCore = Exps.checkType(ctx, exp.type)
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      Exps.check(ctx, exp.exp, typeValue)
      return infer(ctx, exp.ret)
    }

    default: {
      throw new ElaborationError(`infer is not implemented for: ${exp.kind}`)
    }
  }
}
