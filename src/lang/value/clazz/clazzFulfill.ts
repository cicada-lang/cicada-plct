import { applyClosure } from "../../closure"
import * as Errors from "../../errors"
import * as Values from "../../value"
import { assertClazz, Value } from "../../value"

export function clazzFulfill(clazz: Values.Clazz, arg: Value): Values.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new Errors.EvaluationError("cannot apply argument to ClazzNull")
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
        clazzFulfill(clazz.rest, arg),
      )
    }
  }
}
