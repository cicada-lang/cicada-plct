import { InternalError } from "../../errors"
import * as Values from "../../value"

export function appendFulfilledClazz(
  left: Values.Clazz,
  right: Values.Clazz,
): Values.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      return right
    }

    case "ClazzCons": {
      throw new InternalError(`appendFulfilledClazz can not append ClazzCons.`)
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        left.name,
        left.propertyType,
        left.property,
        appendFulfilledClazz(left.rest, right),
      )
    }
  }
}
