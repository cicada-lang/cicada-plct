import { Ctx } from "../ctx"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
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
      return occurType(solution, ctx, name, value.argType)
      // ||      occurClosure(name, value.argType, value.retTypeClosure)
    }

    case "PiImplicit": {
      return occurType(solution, ctx, name, value.argType)
      // ||        occurClosure(name, value.argType, value.retTypeClosure)
    }

    case "Fn": {
      Values.assertValue(type, "Pi")
      return false
      // return occurClosure(name, value.retClosure)
    }

    case "FnImplicit": {
      Values.assertValue(type, "PiImplicit")
      return false
      // return occurClosure(name, value.retClosure)
    }

    case "Sigma": {
      return occurType(solution, ctx, name, value.carType)

      // ||         occurClosure(name, value.carType, value.cdrTypeClosure)
    }

    case "Cons": {
      Values.assertValue(type, "Sigma")
      return false
      // return occur(name, value.car) || occur(name, value.cdr)
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
      return occurType(solution, ctx, name, value.propertyType)
      // ||      occurClosure(name, value.propertyType, value.restClosure)
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
