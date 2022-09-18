import { applyClosure, Closure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import {
  Ctx,
  CtxCons,
  CtxFulfilled,
  ctxNames,
  ctxToEnv,
  lookupTypeInCtx,
  lookupValueInCtx,
} from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import { createPatternVar, Solution, solveType } from "../solution"
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

export function infer(solution: Solution, ctx: Ctx, exp: Exp): Inferred {
  switch (exp.kind) {
    case "Var": {
      const type = lookupTypeInCtx(ctx, exp.name)
      if (type !== undefined) {
        return Inferred(type, Cores.Var(exp.name))
      }

      throw new ElaborationError(`Undefined name ${exp.name}`)
    }

    case "Pi": {
      const argTypeCore = Exps.checkType(solution, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = Exps.checkType(solution, ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.Pi(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "ImplicitPi": {
      const argTypeCore = Exps.checkType(solution, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = Exps.checkType(solution, ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.ImplicitPi(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "FoldedPi": {
      return infer(solution, ctx, Exps.unfoldPi(exp.bindings, exp.retType))
    }

    case "AnnotatedFn": {
      const argTypeCore = Exps.checkType(solution, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retInferred = infer(solution, ctx, exp.ret)
      const retTypeCore = readbackType(ctx, retInferred.type)
      const retTypeClosure = Closure(ctxToEnv(ctx), exp.name, retTypeCore)
      return Inferred(
        Values.Pi(argTypeValue, retTypeClosure),
        Cores.Fn(exp.name, retInferred.core),
      )
    }

    case "AnnotatedImplicitFn": {
      const argTypeCore = Exps.checkType(solution, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retInferred = infer(solution, ctx, exp.ret)
      const retTypeCore = readbackType(ctx, retInferred.type)
      const retTypeClosure = Closure(ctxToEnv(ctx), exp.name, retTypeCore)
      return Inferred(
        Values.ImplicitPi(argTypeValue, retTypeClosure),
        Cores.ImplicitFn(exp.name, retInferred.core),
      )
    }

    case "FoldedFn": {
      return infer(solution, ctx, Exps.unfoldFn(exp.bindings, exp.ret))
    }

    case "FoldedFnWithRetType": {
      return infer(
        solution,
        ctx,
        Exps.unfoldFnWithRetType(exp.bindings, exp.retType, exp.ret),
      )
    }

    case "Ap": {
      // {
      //   const { target, args } = Exps.foldAp(exp)
      //   const inferred = infer(solution, ctx, target)
      //   /**
      //      `ImplicitAp` insertion.
      //   **/
      //   if (
      //     Values.isValue(inferred.type, Values.ImplicitPi) &&
      //     args[0]?.kind === "ArgPlain"
      //   ) {
      //     return Exps.insertImplicitAp(ctx, inferred.type, inferred.core, args)
      //   }
      // }

      const inferred = infer(solution, ctx, exp.target)

      {
        /**
           Try to use `targetValue` first, then use `inferred.type`.
        **/
        const targetValue = evaluate(ctxToEnv(ctx), inferred.core)
        /**
           Fulfilling type.
        **/
        if (Values.isClazz(targetValue)) {
          const argCore = Exps.checkClazzArg(
            solution,
            ctx,
            targetValue,
            exp.arg,
          )
          return Inferred(Values.Type(), Cores.Ap(inferred.core, argCore))
        }
      }

      if (Values.isValue(inferred.type, Values.ImplicitPi)) {
        return inferApImplicitPi(solution, ctx, inferred, exp.arg)
      } else {
        return inferApPi(solution, ctx, inferred, exp.arg)
      }
    }

    case "ImplicitAp": {
      const inferred = infer(solution, ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.ImplicitPi)
      const argCore = Exps.check(solution, ctx, exp.arg, inferred.type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.ImplicitAp(inferred.core, argCore),
      )
    }

    case "FoldedAp": {
      return infer(solution, ctx, Exps.unfoldAp(exp.target, exp.args))
    }

    case "Sigma": {
      const carTypeCore = Exps.checkType(solution, ctx, exp.carType)
      const carTypeValue = evaluate(ctxToEnv(ctx), carTypeCore)
      ctx = CtxCons(exp.name, carTypeValue, ctx)
      const cdrTypeCore = Exps.checkType(solution, ctx, exp.cdrType)
      return Inferred(
        Values.Type(),
        Cores.Sigma(exp.name, carTypeCore, cdrTypeCore),
      )
    }

    case "FoldedSigma": {
      return infer(solution, ctx, Exps.unfoldSigma(exp.bindings, exp.cdrType))
    }

    case "Car": {
      const inferred = infer(solution, ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      return Inferred(sigma.carType, Cores.Car(inferred.core))
    }

    case "Cdr": {
      const inferred = infer(solution, ctx, exp.target)
      Values.assertTypeInCtx(ctx, inferred.type, Values.Sigma)
      const sigma = inferred.type
      const carValue = evaluate(ctxToEnv(ctx), Cores.Car(inferred.core))
      return Inferred(
        applyClosure(sigma.cdrTypeClosure, carValue),
        Cores.Cdr(inferred.core),
      )
    }

    case "Cons": {
      const carInferred = infer(solution, ctx, exp.car)
      const cdrInferred = infer(solution, ctx, exp.cdr)
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
      return Inferred(Values.Type(), Exps.checkClazz(solution, ctx, exp))
    }

    case "FoldedClazz": {
      return infer(solution, ctx, Exps.unfoldClazz(exp.bindings))
    }

    case "Objekt": {
      let clazz: Values.Clazz = Values.ClazzNull()
      let properties: Record<string, Core> = {}
      for (let [name, property] of Object.entries(exp.properties).reverse()) {
        const inferred = infer(solution, ctx, property)
        const value = evaluate(ctxToEnv(ctx), inferred.core)
        clazz = Values.ClazzFulfilled(name, inferred.type, value, clazz)
        properties[name] = inferred.core
      }

      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "FoldedObjekt": {
      return infer(
        solution,
        ctx,
        Exps.Objekt(Exps.prepareProperties(solution, ctx, exp.properties)),
      )
    }

    case "Dot": {
      const inferred = infer(solution, ctx, exp.target)
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
        solution,
        ctx,
        Exps.New(
          exp.name,
          Exps.prepareProperties(solution, ctx, exp.properties),
        ),
      )
    }

    case "New": {
      const clazz = lookupValueInCtx(ctx, exp.name)
      if (clazz === undefined) {
        throw new ElaborationError(`undefined class: ${exp.name}`)
      }

      Values.assertClazzInCtx(ctx, clazz)

      const properties = Exps.inferProperties(
        solution,
        ctx,
        exp.properties,
        clazz,
      )
      const names = Object.keys(properties)

      const extra = Exps.inferExtraProperties(
        solution,
        ctx,
        exp.properties,
        names,
      )

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
      const properties = Exps.checkNewArgs(solution, ctx, exp.args, clazz)
      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "FoldedSequence": {
      return infer(solution, ctx, Exps.unfoldSequence(exp.bindings, exp.ret))
    }

    case "SequenceLet": {
      const inferred = infer(solution, ctx, exp.exp)
      const value = evaluate(ctxToEnv(ctx), inferred.core)
      ctx = CtxFulfilled(exp.name, inferred.type, value, ctx)
      const retInferred = infer(solution, ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), inferred.core),
      )
    }

    case "SequenceLetThe": {
      const typeCore = Exps.checkType(solution, ctx, exp.type)
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      const enriched = Exps.enrichOrCheck(solution, ctx, exp.exp, typeValue)
      const value = evaluate(ctxToEnv(ctx), enriched.core)
      ctx = CtxFulfilled(exp.name, enriched.type, value, ctx)
      const retInferred = infer(solution, ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), enriched.core),
      )
    }

    case "SequenceCheck": {
      const typeCore = Exps.checkType(solution, ctx, exp.type)
      const typeValue = evaluate(ctxToEnv(ctx), typeCore)
      Exps.check(solution, ctx, exp.exp, typeValue)
      return infer(solution, ctx, exp.ret)
    }

    default: {
      throw new ElaborationError(`infer is not implemented for: ${exp.kind}`)
    }
  }
}

export function inferApImplicitPi(
  solution: Solution,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, Values.ImplicitPi)

  const name = inferred.type.retTypeClosure.name
  // TODO Scope BUG, `freshName` might occurs in `args`.
  const usedNames = [...ctxNames(ctx), ...solution.names]
  const freshName = freshen(usedNames, name)
  const patternVar = createPatternVar(inferred.type.argType, freshName)
  ctx = CtxCons(freshName, inferred.type.argType, ctx)
  const retType = applyClosure(inferred.type.retTypeClosure, patternVar)

  /**
     `ImplicitAp` insertion.
  **/
  inferred = Inferred(
    retType,
    Cores.ImplicitAp(inferred.core, Cores.Var(freshName)),
  )

  if (Values.isValue(inferred.type, Values.ImplicitPi)) {
    return inferApImplicitPi(solution, ctx, inferred, argExp)
  } else {
    return inferApPi(solution, ctx, inferred, argExp)
  }
}

export function inferApPi(
  solution: Solution,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, Values.Pi)

  const argInferred = Exps.inferOrUndefined(solution, ctx, argExp)
  if (argInferred !== undefined) {
    solution = solveType(solution, ctx, argInferred.type, inferred.type.argType)
  }

  const argCore = argInferred
    ? argInferred.core
    : Exps.check(solution, ctx, argExp, inferred.type.argType)

  const argValue = evaluate(ctxToEnv(ctx), argCore)

  return Inferred(
    applyClosure(inferred.type.retTypeClosure, argValue),
    Cores.Ap(inferred.core, argCore),
  )
}
