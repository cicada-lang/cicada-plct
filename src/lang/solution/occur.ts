import { Neutral } from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

function occurType(name: string, value: Value): boolean {
  return occur(name, Values.Type(), value)
}

export function occur(name: string, type: Value, value: Value): boolean {
  switch (value.kind) {
    case "TypedNeutral": {
      return occurNeutral(name, value.neutral)
    }

    case "Type": {
      return false
    }

    case "Pi": {
      return occurType(name, value.argType)
      // ||      occurClosure(name, value.argType, value.retTypeClosure)
    }

    case "PiImplicit": {
      return occurType(name, value.argType)
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
      return occurType(name, value.carType)

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
      return occurType(name, value.propertyType)
      // ||      occurClosure(name, value.propertyType, value.restClosure)
    }

    case "ClazzFulfilled": {
      return (
        occurType(name, value.propertyType) ||
        occur(name, value.propertyType, value.property) ||
        occurType(name, value.rest)
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
        occurType(name, value.type) ||
        occur(name, value.type, value.from) ||
        occur(name, value.type, value.to)
      )
    }

    case "Refl": {
      return occurType(name, value.type) || occur(name, value.type, value.value)
    }
  }
}

function occurTypedValue(name: string, typedValue: TypedValue): boolean {
  return (
    occurType(name, typedValue.type) ||
    occur(name, typedValue.type, typedValue.value)
  )
}

function occurNeutral(name: string, neutral: Neutral): boolean {
  switch (neutral.kind) {
    case "Var": {
      return name === neutral.name
    }

    case "Ap": {
      return (
        occurNeutral(name, neutral.target) || occurTypedValue(name, neutral.arg)
      )
    }

    case "ApImplicit": {
      return (
        occurNeutral(name, neutral.target) || occurTypedValue(name, neutral.arg)
      )
    }

    case "Car":
    case "Cdr": {
      return occurNeutral(name, neutral.target)
    }

    case "Dot": {
      return occurNeutral(name, neutral.target)
    }

    case "Replace": {
      return (
        occurNeutral(name, neutral.target) ||
        occurTypedValue(name, neutral.motive) ||
        occurTypedValue(name, neutral.base)
      )
    }
  }
}
