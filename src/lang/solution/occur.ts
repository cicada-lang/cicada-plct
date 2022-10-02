import { Closure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Neutral } from "../neutral"
import { TypedValue, Value } from "../value"

export function occur(name: string, value: Value): boolean {
  switch (value.kind) {
    case "TypedNeutral": {
      return occurNeutral(name, value.neutral)
    }

    case "Type": {
      return false
    }

    case "Pi": {
      return occur(name, value.argType) || occurClosure(name, value.retTypeClosure)
    }

    case "PiImplicit": {
      return occur(name, value.argType) || occurClosure(name, value.retTypeClosure)
    }

    case "Fn": {
      return occurClosure(name, value.retClosure)
    }

    case "FnImplicit": {
      return occurClosure(name, value.retClosure)
    }

    case "Sigma": {
      return occur(name, value.carType) || occurClosure(name, value.cdrTypeClosure)
    }

    case "Cons": {
      return occur(name, value.car) || occur(name, value.cdr)
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
      return (
        occur(name, value.propertyType) ||
        (name != value.name && occurClosure(name, value.restClosure))
      )
    }

    case "ClazzFulfilled": {
      return (
        occur(name, value.propertyType) ||
        occur(name, value.property) ||
        (name != value.name && occur(name, value.rest))
      )
    }

    case "Objekt": {
      return Object.entries(value.properties).some(([key, value]) => {
        return occur(name, value)
      })
    }
  }
}

function occurCore(name: string, core: Core): boolean {
  return Cores.freeNames(new Set(), core).has(name)
}

function occurClosure(name: string, closure: Closure): boolean {
  return name != closure.name && occurCore(name, closure.body)
}

function occurTypedValue(name: string, typedValue: TypedValue): boolean {
  return occur(name, typedValue.type) || occur(name, typedValue.value)
}

function occurNeutral(name: string, neutral: Neutral): boolean {
  switch (neutral.kind) {
    case "Var": {
      return name === neutral.name
    }

    case "Ap": {
      return occurNeutral(name, neutral.target) || occurTypedValue(name, neutral.arg)
    }

    case "ApImplicit": {
      return occurNeutral(name, neutral.target) || occurTypedValue(name, neutral.arg)
    }

    case "Car":
    case "Cdr": {
      return occurNeutral(name, neutral.target)
    }

    case "Dot": {
      return occurNeutral(name, neutral.target)
    }
  }
}
