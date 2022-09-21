import { applyClosure, Closure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import {
  Ctx,
  CtxCons,
  CtxFulfilled,
  ctxNames,
  lookupTypeInCtx,
  lookupValueInCtx,
} from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import { Mod } from "../mod"
import { solveType } from "../solution"
import { freshen } from "../utils/freshen"
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

export function infer(mod: Mod, ctx: Ctx, exp: Exp): Inferred {
  switch (exp.kind) {
    case "Var": {
      const type = lookupTypeInCtx(ctx, exp.name)
      if (type !== undefined) {
        return Inferred(type, Cores.Var(exp.name))
      }

      throw new ElaborationError(`Undefined name ${exp.name}`)
    }

    case "Pi": {
      const argTypeCore = Exps.checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(
        mod.solution.enrichCtx(mod, ctx),
        argTypeCore,
      )
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = Exps.checkType(mod, ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.Pi(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "PiImplicit": {
      const argTypeCore = Exps.checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(
        mod.solution.enrichCtx(mod, ctx),
        argTypeCore,
      )
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = Exps.checkType(mod, ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.PiImplicit(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "PiFolded": {
      return infer(mod, ctx, Exps.unfoldPi(exp.bindings, exp.retType))
    }

    case "FnAnnotated": {
      const argTypeCore = Exps.checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(
        mod.solution.enrichCtx(mod, ctx),
        argTypeCore,
      )
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      const retTypeCore = readbackType(mod, ctx, retInferred.type)
      const retTypeClosure = Closure(
        mod.solution.enrichCtx(mod, ctx),
        exp.name,
        retTypeCore,
      )
      return Inferred(
        Values.Pi(argTypeValue, retTypeClosure),
        Cores.Fn(exp.name, retInferred.core),
      )
    }

    case "FnImplicitAnnotated": {
      const argTypeCore = Exps.checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(
        mod.solution.enrichCtx(mod, ctx),
        argTypeCore,
      )
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      const retTypeCore = readbackType(mod, ctx, retInferred.type)
      const retTypeClosure = Closure(
        mod.solution.enrichCtx(mod, ctx),
        exp.name,
        retTypeCore,
      )
      return Inferred(
        Values.PiImplicit(argTypeValue, retTypeClosure),
        Cores.FnImplicit(exp.name, retInferred.core),
      )
    }

    case "FnFolded": {
      return infer(mod, ctx, Exps.unfoldFn(exp.bindings, exp.ret))
    }

    case "FnFoldedWithRetType": {
      return infer(
        mod,
        ctx,
        Exps.unfoldFnWithRetType(exp.bindings, exp.retType, exp.ret),
      )
    }

    case "Ap": {
      const inferred = infer(mod, ctx, exp.target)

      {
        /**
           Try to use `targetValue` first, then use `inferred.type`.
        **/
        const targetValue = evaluate(
          mod.solution.enrichCtx(mod, ctx),
          inferred.core,
        )
        /**
           Fulfilling type.
        **/
        if (Values.isClazz(targetValue)) {
          const argCore = Exps.checkClazzArg(mod, ctx, targetValue, exp.arg)
          return Inferred(Values.Type(), Cores.Ap(inferred.core, argCore))
        }
      }

      return inferAp(mod, ctx, inferred, exp.arg)
    }

    case "ApImplicit": {
      const inferred = infer(mod, ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.PiImplicit)
      const argCore = Exps.check(mod, ctx, exp.arg, inferred.type.argType)
      const argValue = evaluate(mod.solution.enrichCtx(mod, ctx), argCore)
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.ApImplicit(inferred.core, argCore),
      )
    }

    case "ApFolded": {
      return infer(mod, ctx, Exps.unfoldAp(exp.target, exp.args))
    }

    case "Sigma": {
      const carTypeCore = Exps.checkType(mod, ctx, exp.carType)
      const carTypeValue = evaluate(mod.enrichedEnvFromCtx(ctx), carTypeCore)
      ctx = CtxCons(exp.name, carTypeValue, ctx)
      const cdrTypeCore = Exps.checkType(mod, ctx, exp.cdrType)
      return Inferred(
        Values.Type(),
        Cores.Sigma(exp.name, carTypeCore, cdrTypeCore),
      )
    }

    case "SigmaFolded": {
      return infer(mod, ctx, Exps.unfoldSigma(exp.bindings, exp.cdrType))
    }

    case "Car": {
      const inferred = infer(mod, ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      return Inferred(sigma.carType, Cores.Car(inferred.core))
    }

    case "Cdr": {
      const inferred = infer(mod, ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      const carValue = evaluate(
        mod.enrichedEnvFromCtx(ctx),
        Cores.Car(inferred.core),
      )
      return Inferred(
        applyClosure(sigma.cdrTypeClosure, carValue),
        Cores.Cdr(inferred.core),
      )
    }

    case "Cons": {
      const carInferred = infer(mod, ctx, exp.car)
      const cdrInferred = infer(mod, ctx, exp.cdr)
      const cdrTypeCore = readbackType(mod, ctx, cdrInferred.type)
      const cdrTypeClosure = Closure(
        mod.enrichedEnvFromCtx(ctx),
        "_",
        cdrTypeCore,
      )
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
      return Inferred(Values.Type(), Exps.checkClazz(mod, ctx, exp))
    }

    case "ClazzFolded": {
      return infer(mod, ctx, Exps.unfoldClazz(exp.bindings))
    }

    case "Objekt": {
      let clazz: Values.Clazz = Values.ClazzNull()
      let properties: Record<string, Core> = {}
      for (let [name, property] of Object.entries(exp.properties).reverse()) {
        const inferred = infer(mod, ctx, property)
        const value = evaluate(mod.enrichedEnvFromCtx(ctx), inferred.core)
        clazz = Values.ClazzFulfilled(name, inferred.type, value, clazz)
        properties[name] = inferred.core
      }

      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "ObjektFolded": {
      return infer(
        mod,
        ctx,
        Exps.Objekt(Exps.prepareProperties(mod, ctx, exp.properties)),
      )
    }

    case "Dot": {
      const inferred = infer(mod, ctx, exp.target)
      const targetValue = evaluate(mod.enrichedEnvFromCtx(ctx), inferred.core)
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
      const propertyCore = readback(mod, ctx, propertyType, property)
      return Inferred(propertyType, propertyCore)
    }

    case "NewFolded": {
      return infer(
        mod,
        ctx,
        Exps.New(exp.name, Exps.prepareProperties(mod, ctx, exp.properties)),
      )
    }

    case "New": {
      const clazz = lookupValueInCtx(ctx, exp.name)
      if (clazz === undefined) {
        throw new ElaborationError(`undefined class: ${exp.name}`)
      }

      Values.assertClazzInCtx(ctx, clazz)

      const properties = Exps.inferProperties(mod, ctx, exp.properties, clazz)
      const names = Object.keys(properties)

      const extra = Exps.inferExtraProperties(mod, ctx, exp.properties, names)

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
      const properties = Exps.checkNewArgs(mod, ctx, exp.args, clazz)
      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "SequenceFolded": {
      return infer(mod, ctx, Exps.unfoldSequence(exp.bindings, exp.ret))
    }

    case "SequenceLet": {
      const inferred = infer(mod, ctx, exp.exp)
      const value = evaluate(mod.enrichedEnvFromCtx(ctx), inferred.core)
      ctx = CtxFulfilled(exp.name, inferred.type, value, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), inferred.core),
      )
    }

    case "SequenceLetThe": {
      const typeCore = Exps.checkType(mod, ctx, exp.type)
      const typeValue = evaluate(mod.enrichedEnvFromCtx(ctx), typeCore)
      const enriched = Exps.enrichOrCheck(mod, ctx, exp.exp, typeValue)
      const value = evaluate(mod.enrichedEnvFromCtx(ctx), enriched.core)
      ctx = CtxFulfilled(exp.name, enriched.type, value, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), enriched.core),
      )
    }

    case "SequenceCheck": {
      const typeCore = Exps.checkType(mod, ctx, exp.type)
      const typeValue = evaluate(mod.enrichedEnvFromCtx(ctx), typeCore)
      Exps.check(mod, ctx, exp.exp, typeValue)
      return infer(mod, ctx, exp.ret)
    }

    default: {
      throw new ElaborationError(`infer is not implemented for: ${exp.kind}`)
    }
  }
}

export function inferAp(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred {
  if (Values.isValue(inferred.type, Values.PiImplicit)) {
    return inferApPiImplicit(mod, ctx, inferred, argExp)
  } else {
    return inferApPi(mod, ctx, inferred, argExp)
  }
}

function inferApPiImplicit(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, Values.PiImplicit)

  const name = inferred.type.retTypeClosure.name
  // TODO Scope BUG, `freshName` might occurs in `args`.
  const usedNames = [...ctxNames(ctx), ...mod.solution.names]
  const freshName = freshen(usedNames, name)
  const patternVar = mod.solution.createPatternVar(
    freshName,
    inferred.type.argType,
  )
  ctx = CtxCons(freshName, inferred.type.argType, ctx)
  const retType = applyClosure(inferred.type.retTypeClosure, patternVar)

  /**
     `ApImplicit` insertion.
  **/
  inferred = Inferred(
    retType,
    Cores.ApImplicit(inferred.core, Cores.Var(freshName)),
  )

  return inferAp(mod, ctx, inferred, argExp)
}

function inferApPi(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, Values.Pi)

  const argInferred = Exps.inferOrUndefined(mod, ctx, argExp)
  if (argInferred !== undefined) {
    solveType(mod.solution, ctx, argInferred.type, inferred.type.argType)
  }

  const argCore = argInferred
    ? argInferred.core
    : Exps.check(mod, ctx, argExp, inferred.type.argType)

  const argValue = evaluate(mod.enrichedEnvFromCtx(ctx), argCore)

  return Inferred(
    applyClosure(inferred.type.retTypeClosure, argValue),
    Cores.Ap(inferred.core, argCore),
  )
}
