import * as Cores from "../core"
import { formatCore } from "../core"

export function foldFormatClazz(clazz: Cores.Clazz): {
  bindings: Array<string>
} {
  switch (clazz.kind) {
    case "ClazzNull": {
      return { bindings: [] }
    }

    case "ClazzCons": {
      const propertyType = formatCore(clazz.propertyType)
      const binding = `${clazz.name}: ${propertyType}`
      const { bindings } = foldFormatClazz(clazz.rest)
      return { bindings: [binding, ...bindings] }
    }

    case "ClazzFulfilled": {
      const propertyType = formatCore(clazz.propertyType)
      const property = formatCore(clazz.property)
      const binding = `${clazz.name}: ${propertyType} = ${property}`
      const { bindings } = foldFormatClazz(clazz.rest)
      return { bindings: [binding, ...bindings] }
    }
  }
}
