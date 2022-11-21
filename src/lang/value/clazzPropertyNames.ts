import * as Neutrals from "../neutral"
import * as Values from "../value"

export function clazzPropertyNames(clazz: Values.Clazz): Array<string> {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      return []
    }

    case "ClazzCons": {
      const name = clazz.propertyName
      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(name))
      const rest = Values.clazzClosureApply(clazz.restClosure, v)
      return [name, ...clazzPropertyNames(rest)]
    }

    case "ClazzFulfilled": {
      return [clazz.propertyName, ...clazzPropertyNames(clazz.rest)]
    }
  }
}
