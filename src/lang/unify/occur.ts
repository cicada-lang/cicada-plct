import * as Actions from "../actions"
import { closureApply } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import { Mod } from "../mod"
import type { Neutral } from "../neutral"
import * as Neutrals from "../neutral"
import { solutionNames } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

function occurType(mod: Mod, ctx: Ctx, name: string, value: Value): boolean {
  return occur(mod, ctx, name, Values.Type(), value)
}

export function occur(
  mod: Mod,
  ctx: Ctx,
  name: string,
  type: Value,
  value: Value,
): boolean {
  switch (value.kind) {
    case "TypedNeutral": {
      return occurNeutral(mod, ctx, name, value.neutral)
    }

    case "Type": {
      return false
    }

    case "Pi": {
      if (occurType(mod, ctx, name, value.argType)) return true

      const boundName = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.argType, Neutrals.Var(freshName))
      const retType = closureApply(value.retTypeClosure, v)
      return occurType(mod, ctx, name, retType)
    }

    case "PiImplicit": {
      if (occurType(mod, ctx, name, value.argType)) return true

      const boundName = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.argType, Neutrals.Var(freshName))
      const retType = closureApply(value.retTypeClosure, v)
      return occurType(mod, ctx, name, retType)
    }

    case "Fn": {
      Values.assertTypeInCtx(mod, ctx, type, "Pi")

      const boundName = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = closureApply(type.retTypeClosure, v)
      const ret = closureApply(value.retClosure, v)
      return occur(mod, ctx, name, retType, ret)
    }

    case "FnImplicit": {
      Values.assertTypeInCtx(mod, ctx, type, "PiImplicit")

      const boundName = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = closureApply(type.retTypeClosure, v)
      const ret = closureApply(value.retClosure, v)
      return occur(mod, ctx, name, retType, ret)
    }

    case "Sigma": {
      if (occurType(mod, ctx, name, value.carType)) return true

      const boundName = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.carType, Neutrals.Var(freshName))
      const cdrType = closureApply(value.cdrTypeClosure, v)
      return occurType(mod, ctx, name, cdrType)
    }

    case "Cons": {
      Values.assertTypeInCtx(mod, ctx, type, "Sigma")

      if (occur(mod, ctx, name, type.carType, value.car)) return true

      const cdrType = closureApply(type.cdrTypeClosure, value.car)
      return occur(mod, ctx, name, cdrType, value.cdr)
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
      if (occurType(mod, ctx, name, value.propertyType)) return true

      const boundName = value.restClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution), name]
      const freshName = freshen(usedNames, boundName)
      const v = Values.TypedNeutral(value.propertyType, Neutrals.Var(freshName))
      const rest = closureApply(value.restClosure, v)
      return occurType(mod, ctx, name, rest)
    }

    case "ClazzFulfilled": {
      return (
        occurType(mod, ctx, name, value.propertyType) ||
        occur(mod, ctx, name, value.propertyType, value.property) ||
        occurType(mod, ctx, name, value.rest)
      )
    }

    case "Objekt": {
      Values.assertClazzInCtx(mod, ctx, type)
      return occurProperties(mod, ctx, name, type, value)
    }

    case "Equal": {
      return (
        occurType(mod, ctx, name, value.type) ||
        occur(mod, ctx, name, value.type, value.from) ||
        occur(mod, ctx, name, value.type, value.to)
      )
    }

    case "Refl": {
      return (
        occurType(mod, ctx, name, value.type) ||
        occur(mod, ctx, name, value.type, value.value)
      )
    }
  }
}

function occurProperties(
  mod: Mod,
  ctx: Ctx,
  name: string,
  clazz: Values.Clazz,
  value: Value,
): boolean {
  switch (clazz.kind) {
    case "ClazzNull": {
      return false
    }

    case "ClazzCons": {
      const propertyValue = Actions.doDot(value, clazz.propertyName)
      const rest = Values.clazzClosureApply(clazz.restClosure, propertyValue)
      return (
        occur(mod, ctx, name, clazz.propertyType, propertyValue) ||
        occurProperties(mod, ctx, name, rest, value)
      )
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, clazz.propertyName)
      return (
        occur(mod, ctx, name, clazz.propertyType, propertyValue) ||
        occurProperties(mod, ctx, name, clazz.rest, value)
      )
    }
  }
}

function occurTypedValue(
  mod: Mod,
  ctx: Ctx,
  name: string,
  typedValue: TypedValue,
): boolean {
  return (
    occurType(mod, ctx, name, typedValue.type) ||
    occur(mod, ctx, name, typedValue.type, typedValue.value)
  )
}

function occurNeutral(
  mod: Mod,
  ctx: Ctx,
  name: string,
  neutral: Neutral,
): boolean {
  switch (neutral.kind) {
    case "Var": {
      // return name === neutral.name
      return false
    }

    case "MetaVar": {
      return name === neutral.name
    }

    case "Ap": {
      return (
        occurNeutral(mod, ctx, name, neutral.target) ||
        occurTypedValue(mod, ctx, name, neutral.arg)
      )
    }

    case "ApImplicit": {
      return (
        occurNeutral(mod, ctx, name, neutral.target) ||
        occurTypedValue(mod, ctx, name, neutral.arg)
      )
    }

    case "Car":
    case "Cdr": {
      return occurNeutral(mod, ctx, name, neutral.target)
    }

    case "Dot": {
      return occurNeutral(mod, ctx, name, neutral.target)
    }

    case "Replace": {
      return (
        occurNeutral(mod, ctx, name, neutral.target) ||
        occurTypedValue(mod, ctx, name, neutral.motive) ||
        occurTypedValue(mod, ctx, name, neutral.base)
      )
    }
  }
}
