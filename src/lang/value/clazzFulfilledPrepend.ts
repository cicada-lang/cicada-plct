import * as Errors from "../errors"
import * as Values from "../value"

export function clazzFulfilledPrepend(
  left: Values.Clazz,
  right: Values.Clazz,
): Values.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      return right
    }

    case "ClazzCons": {
      throw new Errors.InternalError(
        `clazzFulfilledPrepend can not append ClazzCons.`,
      )
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        left.name,
        left.propertyType,
        left.property,
        clazzFulfilledPrepend(left.rest, right),
      )
    }
  }
}
