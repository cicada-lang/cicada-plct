import { applyClosure } from "../../closure"
import * as Neutrals from "../../neutral"
import * as Values from "../../value"
import { assertClazz } from "../../value"

export function clazzPropertyNames(clazz: Values.Clazz): Array<string> {
  switch (clazz.kind) {
    case "ClazzNull": {
      return []
    }

    case "ClazzCons": {
      const typedNeutral = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(clazz.name))
      const rest = applyClosure(clazz.restClosure, typedNeutral)
      assertClazz(rest)
      return [clazz.name, ...clazzPropertyNames(rest)]
    }

    case "ClazzFulfilled": {
      return [clazz.name, ...clazzPropertyNames(clazz.rest)]
    }
  }
}
