import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { Neutral } from "../neutral"
import { Solution, solutionNames } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

function occurType(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  name: string,
  value: Value,
): boolean {
  return occur(mod, ctx, solution, name, Values.Type(), value)
}

export function occur(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  name: string,
  type: Value,
  value: Value,
): boolean {
  switch (value.kind) {
    case "TypedNeutral": {
      return occurNeutral(mod, ctx, solution, name, value.neutral)
    }

    case "Type": {
      return false
    }

    case "Pi": {
      if (occurType(mod, ctx, solution, name, value.argType)) return true

      const boundName = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.argType, Neutrals.Var(freshName))
      const retType = applyClosure(value.retTypeClosure, v)
      return occurType(mod, ctx, solution, name, retType)
    }

    case "PiImplicit": {
      if (occurType(mod, ctx, solution, name, value.argType)) return true

      const boundName = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.argType, Neutrals.Var(freshName))
      const retType = applyClosure(value.retTypeClosure, v)
      return occurType(mod, ctx, solution, name, retType)
    }

    case "Fn": {
      Values.assertTypeInCtx(mod, ctx, type, "Pi")

      const boundName = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = applyClosure(type.retTypeClosure, v)
      const ret = applyClosure(value.retClosure, v)
      return occur(mod, ctx, solution, name, retType, ret)
    }

    case "FnImplicit": {
      Values.assertTypeInCtx(mod, ctx, type, "PiImplicit")

      const boundName = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = applyClosure(type.retTypeClosure, v)
      const ret = applyClosure(value.retClosure, v)
      return occur(mod, ctx, solution, name, retType, ret)
    }

    case "Sigma": {
      if (occurType(mod, ctx, solution, name, value.carType)) return true

      const boundName = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.carType, Neutrals.Var(freshName))
      const cdrType = applyClosure(value.cdrTypeClosure, v)
      return occurType(mod, ctx, solution, name, cdrType)
    }

    case "Cons": {
      Values.assertTypeInCtx(mod, ctx, type, "Sigma")

      if (occur(mod, ctx, solution, name, type.carType, value.car)) return true

      const cdrType = applyClosure(type.cdrTypeClosure, value.car)
      return occur(mod, ctx, solution, name, cdrType, value.cdr)
    }

    case "String": {
      return false
    }

    case "Quote": {
      return false
    }

    case "Trivial": {
      return false
    }

    case "Sole": {
      return false
    }

    case "ClazzNull": {
      return false
    }

    case "ClazzCons": {
      if (occurType(mod, ctx, solution, name, value.propertyType)) return true

      const boundName = value.restClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.propertyType, Neutrals.Var(freshName))
      const rest = applyClosure(value.restClosure, v)
      return occurType(mod, ctx, solution, name, rest)
    }

    case "ClazzFulfilled": {
      return (
        occurType(mod, ctx, solution, name, value.propertyType) ||
        occur(mod, ctx, solution, name, value.propertyType, value.property) ||
        occurType(mod, ctx, solution, name, value.rest)
      )
    }

    case "Objekt": {
      Values.assertClazzInCtx(mod, ctx, type)

      return occurProperties(mod, ctx, solution, name, type, value)
    }

    case "Equal": {
      return (
        occurType(mod, ctx, solution, name, value.type) ||
        occur(mod, ctx, solution, name, value.type, value.from) ||
        occur(mod, ctx, solution, name, value.type, value.to)
      )
    }

    case "Refl": {
      return (
        occurType(mod, ctx, solution, name, value.type) ||
        occur(mod, ctx, solution, name, value.type, value.value)
      )
    }
  }
}

function occurProperties(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  name: string,
  clazz: Values.Clazz,
  value: Value,
): boolean {
  switch (clazz.kind) {
    case "ClazzNull": {
      return false
    }

    case "ClazzCons": {
      const propertyValue = Actions.doDot(value, clazz.name)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      Values.assertClazzInCtx(mod, ctx, rest)
      return (
        occur(mod, ctx, solution, name, clazz.propertyType, propertyValue) ||
        occurProperties(mod, ctx, solution, name, rest, value)
      )
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, clazz.name)
      return (
        occur(mod, ctx, solution, name, clazz.propertyType, propertyValue) ||
        occurProperties(mod, ctx, solution, name, clazz.rest, value)
      )
    }
  }
}

function occurTypedValue(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  name: string,
  typedValue: TypedValue,
): boolean {
  return (
    occurType(mod, ctx, solution, name, typedValue.type) ||
    occur(mod, ctx, solution, name, typedValue.type, typedValue.value)
  )
}

function occurNeutral(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  name: string,
  neutral: Neutral,
): boolean {
  switch (neutral.kind) {
    case "Var": {
      return name === neutral.name
    }

    case "Ap": {
      return (
        occurNeutral(mod, ctx, solution, name, neutral.target) ||
        occurTypedValue(mod, ctx, solution, name, neutral.arg)
      )
    }

    case "ApImplicit": {
      return (
        occurNeutral(mod, ctx, solution, name, neutral.target) ||
        occurTypedValue(mod, ctx, solution, name, neutral.arg)
      )
    }

    case "Car":
    case "Cdr": {
      return occurNeutral(mod, ctx, solution, name, neutral.target)
    }

    case "Dot": {
      return occurNeutral(mod, ctx, solution, name, neutral.target)
    }

    case "Replace": {
      return (
        occurNeutral(mod, ctx, solution, name, neutral.target) ||
        occurTypedValue(mod, ctx, solution, name, neutral.motive) ||
        occurTypedValue(mod, ctx, solution, name, neutral.base)
      )
    }
  }
}
