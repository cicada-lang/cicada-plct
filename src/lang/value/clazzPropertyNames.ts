import * as Neutrals from "../neutral/index.js"
import * as Values from "../value/index.js"

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
