import { applyClosure, constClosure } from "../closure"
import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function deepWalk(solution: Solution, value: Value): Value {
  value = solution.walk(value)

  switch (value.kind) {
    case "TypedNeutral": {
      // TODO Maybe blocked can be eliminated now!
      return value
    }

    case "Type": {
      return value
    }

    case "Pi": {
      // TODO
      return value
    }

    case "ImplicitPi": {
      // TODO
      return value
    }

    case "Fn": {
      return value
    }

    case "ImplicitFn": {
      // TODO
      return value
    }

    case "Sigma": {
      const type = value
      const name = type.cdrTypeClosure.name
      const variable = Neutrals.Var(name)
      const carType = deepWalk(solution, type.carType)
      const typedNeutral = Values.TypedNeutral(carType, variable)
      let cdrType = applyClosure(type.cdrTypeClosure, typedNeutral)
      cdrType = deepWalk(solution, cdrType)
      return Values.Sigma(carType, constClosure(solution, cdrType))
    }

    case "Cons": {
      // TODO
      return value
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

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      // TODO
      return value
    }

    case "Objekt": {
      // TODO
      return value
    }
  }
}
