import _ from "lodash"
import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { EquationError } from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { deepWalkProperties, deepWalkType } from "../solution"
import { freshen } from "../utils/freshen"
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
      // TODO Maybe blocked can be eliminated now!
      return value
    }

    case "Type": {
      return value
    }

    case "Pi": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(value.retTypeClosure, typedNeutral)
      retType = deepWalkType(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.Pi(argType, Closure(env, freshName, retTypeCore))
    }

    case "PiImplicit": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(value.retTypeClosure, typedNeutral)
      retType = deepWalkType(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.PiImplicit(argType, Closure(env, freshName, retTypeCore))
    }

    case "Fn": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      Values.assertTypeInCtx(ctx, type, Values.Pi)
      const argType = deepWalkType(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let ret = applyClosure(value.retClosure, typedNeutral)
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      ret = deepWalk(mod, ctx, retType, ret)
      ctx = CtxCons(freshName, argType, ctx)
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.Fn(Closure(env, freshName, retCore))
    }

    case "FnImplicit": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      Values.assertTypeInCtx(ctx, type, Values.PiImplicit)
      const argType = deepWalkType(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let ret = applyClosure(value.retClosure, typedNeutral)
      let retType = applyClosure(type.retTypeClosure, typedNeutral)
      retType = deepWalkType(mod, ctx, retType)
      ret = deepWalk(mod, ctx, retType, ret)
      ctx = CtxCons(freshName, argType, ctx)
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.FnImplicit(Closure(env, freshName, retCore))
    }

    case "Sigma": {
      const name = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const carType = deepWalkType(mod, ctx, value.carType)
      const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let cdrType = applyClosure(value.cdrTypeClosure, typedNeutral)
      cdrType = deepWalkType(mod, ctx, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
      return Values.Sigma(carType, Closure(env, freshName, cdrTypeCore))
    }

    case "Cons": {
      type = deepWalkType(mod, ctx, type)
      Values.assertTypeInCtx(ctx, type, Values.Sigma)
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
      // TODO
      return value
      // const name = value.name
      // const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      // const freshName = freshen(usedNames, name)
      // const propertyType = deepWalkType(mod, ctx, value.propertyType)
      // const typedNeutral = Values.TypedNeutral(
      //   propertyType,
      //   Neutrals.Var(freshName),
      // )
      // mod.solution.bind(freshName, typedNeutral)
      // let rest = applyClosure(value.restClosure, typedNeutral)
      // rest = deepWalkType(mod, ctx, rest)
      // ctx = CtxCons(freshName, propertyType, ctx)
      // const restCore = readbackType(mod, ctx, rest)
      // const env = mod.ctxToEnv(ctx)
      // return Values.ClazzCons(
      //   value.name,
      //   propertyType,
      //   Closure(env, freshName, restCore),
      // )
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
  if (Values.isValue(value, Values.Objekt)) {
    const clazzNames = Values.clazzPropertyNames(clazz)
    const valueNames = Object.keys(value.properties)
    const extraNames = _.difference(valueNames, clazzNames)

    if (extraNames.length > 0) {
      throw new EquationError(`expect no extra common names: ${extraNames}`)
    }
  }
}
