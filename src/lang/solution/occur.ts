import { Closure } from "../closure"
import { Core } from "../core"
import { Neutral } from "../neutral"
import { TypedValue, Value } from "../value"

export function occur(name: String, value: Value): Boolean {
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

function occurCore(name: String, core: Core): Boolean {
  switch (core.kind) {
    case "Var": {
      return name === core.name
    }

    case "Pi": {
      return occurCore(name, core.argType) || (core.name !== name && occurCore(name, core.retType))
    }

    case "PiImplicit": {
      return occurCore(name, core.argType) || (core.name !== name && occurCore(name, core.retType))
    }

    case "Fn": {
      return core.name !== name && occurCore(name, core.ret)
    }

    case "FnImplicit": {
      return core.name !== name && occurCore(name, core.ret)
    }

    case "Ap": {
      return occurCore(name, core.target) || occurCore(name, core.arg)
    }

    case "ApImplicit": {
      return occurCore(name, core.target) || occurCore(name, core.arg)
    }

    case "Sigma": {
      return occurCore(name, core.carType) || (core.name !== name && occurCore(name, core.cdrType))
    }

    case "Cons": {
      return occurCore(name, core.car) || occurCore(name, core.cdr)
    }

    case "Car":
    case "Cdr": {
      return occurCore(name, core.target)
    }

    case "Quote": {
      return false
    }

    case "ClazzNull": {
      return false
    }
    case "ClazzCons": {
      return (
        occurCore(name, core.propertyType) || (core.name !== name && occurCore(name, core.rest))
      )
    }
    case "ClazzFulfilled": {
      return (
        occurCore(name, core.propertyType) ||
        occurCore(name, core.property) ||
        (core.name !== name && occurCore(name, core.rest))
      )
    }

    case "Objekt": {
      return Object.entries(core.properties).some(([key, value]) => {
        return occurCore(name, value)
      })
    }

    case "Dot": {
      return occurCore(name, core.target)
    }
  }
}

function occurClosure(name: String, closure: Closure): Boolean {
  return name != closure.name && occurCore(name, closure.body)
}

function occurTypedValue(name: String, typedValue: TypedValue): Boolean {
  return occur(name, typedValue.type) || occur(name, typedValue.value)
}

function occurNeutral(name: String, neutral: Neutral): Boolean {
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
