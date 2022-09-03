import * as Actions from "../actions"
import * as Values from "../value"
import { applyClosure, assertValues, Value } from "../value"

export function lookupClazzPropertyType(
  clazz: Values.Clazz,
  target: Value,
  name: string
): Value | undefined {
  switch (clazz.kind) {
    case "ClazzNull": {
      return undefined
    }

    case "ClazzCons": {
      if (clazz.name === name) return clazz.propertyType

      const rest = applyClosure(
        clazz.restClosure,
        Actions.doDot(target, clazz.name)
      )

      assertValues(rest, [
        Values.ClazzNull,
        Values.ClazzCons,
        Values.ClazzFulfilled,
      ])

      return lookupClazzPropertyType(rest, target, name)
    }

    case "ClazzFulfilled": {
      if (clazz.name === name) return clazz.propertyType

      throw new Error("TODO")
    }
  }
}
