import * as Errors from "../errors/index.js"
import * as Values from "../value/index.js"

export function clazzFulfilledPrepend(
  left: Values.Clazz,
  right: Values.Clazz,
): Values.Clazz {
  switch (left["@kind"]) {
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
        left.propertyName,
        left.propertyType,
        left.property,
        clazzFulfilledPrepend(left.rest, right),
        left.name,
      )
    }
  }
}
