import * as Cores from "../../core"

export function appendClazz(
  left: Cores.Clazz,
  right: Cores.Clazz,
): Cores.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      return right
    }

    case "ClazzCons": {
      return Cores.ClazzCons(
        left.name,
        left.localName,
        left.propertyType,
        appendClazz(left.rest, right),
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        left.name,
        left.propertyType,
        left.property,
        appendClazz(left.rest, right),
      )
    }
  }
}
