import * as Cores from "../core"

export function clazzAppend(
  left: Cores.Clazz,
  right: Cores.Clazz,
): Cores.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      return right
    }

    case "ClazzCons": {
      return Cores.ClazzCons(
        left.propertyName,
        left.localName,
        left.propertyType,
        clazzAppend(left.rest, right),
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        left.propertyName,
        left.propertyType,
        left.property,
        clazzAppend(left.rest, right),
      )
    }
  }
}
