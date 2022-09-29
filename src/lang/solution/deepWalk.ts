import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { deepWalkNeutral, deepWalkType } from "../solution"
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

export function deepWalk(mod: Mod, ctx: Ctx, value: Value): Value {
  value = mod.solution.walk(value)

  switch (value.kind) {
    case "TypedNeutral": {
      return Values.TypedNeutral(
        deepWalkType(mod, ctx, value.type),
        deepWalkNeutral(mod, ctx, value.neutral),
      )
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
      ctx = CtxCons(freshName, argType, ctx)
      const retType = deepWalkType(mod, ctx, applyClosure(value.retTypeClosure, typedNeutral))
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
      ctx = CtxCons(freshName, argType, ctx)
      const retType = deepWalkType(mod, ctx, applyClosure(value.retTypeClosure, typedNeutral))
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.PiImplicit(argType, Closure(env, freshName, retTypeCore))
    }

    case "Fn": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      ctx = CtxCons(freshName, argType, ctx)
      const ret = deepWalk(mod, ctx, applyClosure(value.retClosure, typedNeutral))
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.Fn(argType, Closure(env, freshName, retCore))
    }

    case "FnImplicit": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      ctx = CtxCons(freshName, argType, ctx)
      const ret = deepWalk(mod, ctx, applyClosure(value.retClosure, typedNeutral))
      const retCore = readback(mod, ctx, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.FnImplicit(argType, Closure(env, freshName, retCore))
    }

    case "Sigma": {
      const name = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const carType = deepWalkType(mod, ctx, value.carType)
      const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))
      ctx = CtxCons(freshName, carType, ctx)
      const cdrType = deepWalkType(mod, ctx, applyClosure(value.cdrTypeClosure, typedNeutral))
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
      return Values.Sigma(carType, Closure(env, freshName, cdrTypeCore))
    }

    case "Cons": {
      return Values.Cons(deepWalk(mod, ctx, value.car), deepWalk(mod, ctx, value.cdr))
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
      const freshName = freshen(usedNames, name)
      const propertyType = deepWalkType(mod, ctx, value.propertyType)
      const typedNeutral = Values.TypedNeutral(propertyType, Neutrals.Var(freshName))
      ctx = CtxCons(freshName, propertyType, ctx)
      const rest = deepWalkType(mod, ctx, applyClosure(value.restClosure, typedNeutral))
      const restCore = readbackType(mod, ctx, rest)
      const env = mod.ctxToEnv(ctx)
      return Values.ClazzCons(value.name, propertyType, Closure(env, freshName, restCore))
    }

    case "ClazzFulfilled": {
      const property = deepWalk(mod, ctx, value.property)
      const rest = deepWalkType(mod, ctx, value.rest)
      Values.assertClazzInCtx(ctx, rest)
      return Values.ClazzFulfilled(value.name, propertyType, property, rest)
    }

    case "Objekt": {
      return Values.Objekt(
        Object.fromEntries(
          Object.entries(value.properties).map(([name, property]) => [
            name,
            deepWalk(mod, ctx, property),
          ]),
        ),
      )
    }
  }
}
