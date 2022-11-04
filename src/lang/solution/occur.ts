import { applyClosure } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import * as Neutrals from "../neutral"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

function occurType(
  solution: Solution,
  ctx: Ctx,
  name: string,
  value: Value,
): boolean {
  return occur(solution, ctx, name, Values.Type(), value)
}

export function occur(
  solution: Solution,
  ctx: Ctx,
  name: string,
  type: Value,
  value: Value,
): boolean {
  switch (value.kind) {
    case "TypedNeutral": {
      return occurNeutral(solution, ctx, name, value.neutral)
    }

    case "Type": {
      return false
    }

    case "Pi": {
      if (occurType(solution, ctx, name, value.argType)) return true

      const boundName = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, boundName)
      const typedNeutral = Values.TypedNeutral(
        value.argType,
        Neutrals.Var(freshName),
      )
      const retType = applyClosure(value.retTypeClosure, typedNeutral)
      return occurType(solution, ctx, name, retType)
    }

    case "PiImplicit": {
      if (occurType(solution, ctx, name, value.argType)) return true

      const boundName = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, boundName)
      const typedNeutral = Values.TypedNeutral(
        value.argType,
        Neutrals.Var(freshName),
      )
      const retType = applyClosure(value.retTypeClosure, typedNeutral)
      return occurType(solution, ctx, name, retType)
    }

    case "Fn": {
      Values.assertValue(type, "Pi")

      const boundName = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, boundName)
      const typedNeutral = Values.TypedNeutral(
        type.argType,
        Neutrals.Var(freshName),
      )
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      const ret = applyClosure(value.retClosure, typedNeutral)
      return occur(solution, ctx, name, retType, ret)
    }

    case "FnImplicit": {
      Values.assertValue(type, "PiImplicit")

      const boundName = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, boundName)
      const typedNeutral = Values.TypedNeutral(
        type.argType,
        Neutrals.Var(freshName),
      )
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      const ret = applyClosure(value.retClosure, typedNeutral)
      return occur(solution, ctx, name, retType, ret)
    }

    case "Sigma": {
      if (occurType(solution, ctx, name, value.carType)) return true

      const boundName = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, boundName)
      const typedNeutral = Values.TypedNeutral(
        value.carType,
        Neutrals.Var(freshName),
      )
      const cdrType = applyClosure(value.cdrTypeClosure, typedNeutral)
      return occurType(solution, ctx, name, cdrType)
    }

    case "Cons": {
      Values.assertValue(type, "Sigma")

      if (occur(solution, ctx, name, type.carType, value.car)) return true

      const cdrType = applyClosure(type.cdrTypeClosure, value.car)
      return occur(solution, ctx, name, cdrType, value.cdr)
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
      if (occurType(solution, ctx, name, value.propertyType)) return true

      const boundName = value.restClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, boundName)
      const typedNeutral = Values.TypedNeutral(
        value.propertyType,
        Neutrals.Var(freshName),
      )
      const rest = applyClosure(value.restClosure, typedNeutral)
      return occurType(solution, ctx, name, rest)
    }

    case "ClazzFulfilled": {
      return (
        occurType(solution, ctx, name, value.propertyType) ||
        occur(solution, ctx, name, value.propertyType, value.property) ||
        occurType(solution, ctx, name, value.rest)
      )
    }

    case "Objekt": {
      Values.assertClazz(type)
      return false
      // return Object.entries(value.properties).some(([key, value]) => {
      //   return occur(name, value)
      // })
    }

    case "Equal": {
      return (
        occurType(solution, ctx, name, value.type) ||
        occur(solution, ctx, name, value.type, value.from) ||
        occur(solution, ctx, name, value.type, value.to)
      )
    }

    case "Refl": {
      return (
        occurType(solution, ctx, name, value.type) ||
        occur(solution, ctx, name, value.type, value.value)
      )
    }
  }
}

function occurTypedValue(
  solution: Solution,
  ctx: Ctx,
  name: string,
  typedValue: TypedValue,
): boolean {
  return (
    occurType(solution, ctx, name, typedValue.type) ||
    occur(solution, ctx, name, typedValue.type, typedValue.value)
  )
}

function occurNeutral(
  solution: Solution,
  ctx: Ctx,
  name: string,
  neutral: Neutral,
): boolean {
  switch (neutral.kind) {
    case "Var": {
      return name === neutral.name
    }

    case "Ap": {
      return (
        occurNeutral(solution, ctx, name, neutral.target) ||
        occurTypedValue(solution, ctx, name, neutral.arg)
      )
    }

    case "ApImplicit": {
      return (
        occurNeutral(solution, ctx, name, neutral.target) ||
        occurTypedValue(solution, ctx, name, neutral.arg)
      )
    }

    case "Car":
    case "Cdr": {
      return occurNeutral(solution, ctx, name, neutral.target)
    }

    case "Dot": {
      return occurNeutral(solution, ctx, name, neutral.target)
    }

    case "Replace": {
      return (
        occurNeutral(solution, ctx, name, neutral.target) ||
        occurTypedValue(solution, ctx, name, neutral.motive) ||
        occurTypedValue(solution, ctx, name, neutral.base)
      )
    }
  }
}
