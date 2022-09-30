import _ from "lodash"
import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { deepWalkNeutral, deepWalkProperties, deepWalkType } from "../solution"
import * as Values from "../value"
import { readback, readbackType, Value } from "../value"

/**

   # `deepWalk` need to do partial evaluation on `Fn`

   `deepWalk` takes `type` as argument,
   NOT because of it is doing eta-expansion,
   but because of it need to do partial evaluation of `Fn`,
   thus need `argType` to construct a `TypedNeutral`.

   another solution is to let `Values.Fn` and `Cores.Fn` always have `argType`.

**/

export function deepWalk(mod: Mod, ctx: Ctx, type: Value, value: Value): Value {
  value = mod.solution.walk(value)

  switch (value.kind) {
    case "TypedNeutral": {
      return deepWalkNeutral(mod, ctx, value)
    }

    case "Type": {
      return value
    }

    case "Pi": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(name))
      ctx = CtxCons(name, argType, ctx)
      const retType = deepWalkType(mod, ctx, applyClosure(value.retTypeClosure, typedNeutral))
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.Pi(argType, Closure(env, name, retTypeCore))
    }

    case "PiImplicit": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(name))
      ctx = CtxCons(name, argType, ctx)
      const retType = deepWalkType(mod, ctx, applyClosure(value.retTypeClosure, typedNeutral))
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.PiImplicit(argType, Closure(env, name, retTypeCore))
    }

    case "Fn": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      Values.assertTypeInCtx(ctx, type, "Pi")
      const argType = deepWalkType(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(name))
      ctx = CtxCons(name, argType, ctx)
      const retType = deepWalkType(mod, ctx, applyClosure(type.retTypeClosure, typedNeutral))
      const ret = deepWalk(mod, ctx, retType, applyClosure(value.retClosure, typedNeutral))
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.Fn(Closure(env, name, retCore))
    }

    case "FnImplicit": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      Values.assertTypeInCtx(ctx, type, "PiImplicit")
      const argType = deepWalkType(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(name))
      ctx = CtxCons(name, argType, ctx)
      const retType = deepWalkType(mod, ctx, applyClosure(type.retTypeClosure, typedNeutral))
      const ret = deepWalk(mod, ctx, retType, applyClosure(value.retClosure, typedNeutral))
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.FnImplicit(Closure(env, name, retCore))
    }

    case "Sigma": {
      const name = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const carType = deepWalkType(mod, ctx, value.carType)
      const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(name))
      ctx = CtxCons(name, carType, ctx)
      const cdrType = deepWalkType(mod, ctx, applyClosure(value.cdrTypeClosure, typedNeutral))
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
      return Values.Sigma(carType, Closure(env, name, cdrTypeCore))
    }

    case "Cons": {
      type = deepWalkType(mod, ctx, type)
      Values.assertTypeInCtx(ctx, type, "Sigma")
      const cdrType = applyClosure(type.cdrTypeClosure, value.car)
      return Values.Cons(
        deepWalk(mod, ctx, type.carType, value.car),
        deepWalk(mod, ctx, cdrType, value.cdr),
      )
    }

    case "String": {
      return value
    }

    case "Quote": {
      return value
    }

    case "Trivial": {
      return value
    }

    case "Sole": {
      return value
    }

    case "ClazzNull": {
      return value
    }

    case "ClazzCons": {
      const name = value.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const propertyType = deepWalkType(mod, ctx, value.propertyType)
      const typedNeutral = Values.TypedNeutral(propertyType, Neutrals.Var(name))
      ctx = CtxCons(name, propertyType, ctx)
      const rest = deepWalkType(mod, ctx, applyClosure(value.restClosure, typedNeutral))
      const restCore = readbackType(mod, ctx, rest)
      const env = mod.ctxToEnv(ctx)
      return Values.ClazzCons(value.name, propertyType, Closure(env, name, restCore))
    }

    case "ClazzFulfilled": {
      const propertyType = deepWalkType(mod, ctx, value.propertyType)
      const property = deepWalk(mod, ctx, propertyType, value.property)
      const rest = deepWalkType(mod, ctx, value.rest)
      Values.assertClazzInCtx(ctx, rest)
      return Values.ClazzFulfilled(value.name, propertyType, property, rest)
    }

    case "Objekt": {
      type = deepWalkType(mod, ctx, type)
      Values.assertClazzInCtx(ctx, type)
      const result = Values.Objekt(deepWalkProperties(mod, ctx, type, value))
      assertNoExtraProperties(type, result)
      return result
    }
  }
}

function assertNoExtraProperties(clazz: Values.Clazz, value: Value): void {
  if (Values.isValue(value, "Objekt")) {
    const clazzNames = Values.clazzPropertyNames(clazz)
    const valueNames = Object.keys(value.properties)
    const extraNames = _.difference(valueNames, clazzNames)
    if (extraNames.length > 0) {
      throw new Errors.UnificationError(`expect no extra common names: ${extraNames}`)
    }
  }
}
