import { applyClosure } from "../../closure"
import { EvaluationError } from "../../errors"
import * as Values from "../../value"
import { assertClazz, Value } from "../../value"

export function fulfillClazz(clazz: Values.Clazz, arg: Value): Values.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new EvaluationError("cannot apply argument to ClazzNull")
    }

    case "ClazzCons": {
      const rest = applyClosure(clazz.restClosure, arg)
      assertClazz(rest)
      return Values.ClazzFulfilled(clazz.name, clazz.propertyType, arg, rest)
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        clazz.name,
        clazz.propertyType,
        clazz.property,
        fulfillClazz(clazz.rest, arg),
      )
    }
  }
}
