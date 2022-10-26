import * as Errors from "../../errors"
import * as Values from "../../value"

export function prependFulfilledClazz(
  left: Values.Clazz,
  right: Values.Clazz,
): Values.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      return right
    }

    case "ClazzCons": {
      throw new Errors.InternalError(
        `prependFulfilledClazz can not append ClazzCons.`,
      )
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        left.name,
        left.propertyType,
        left.property,
        prependFulfilledClazz(left.rest, right),
      )
    }
  }
}
