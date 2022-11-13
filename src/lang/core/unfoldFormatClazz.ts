import * as Cores from "../core"
import { formatCore } from "../core"
import { isIdentifier } from "../utils/isIdentifier"

export function unfoldFormatClazz(clazz: Cores.Clazz): {
  bindings: Array<string>
} {
  switch (clazz.kind) {
    case "ClazzNull": {
      return { bindings: [] }
    }

    case "ClazzCons": {
      const propertyType = formatCore(clazz.propertyType)
      const key =
        clazz.name === clazz.localName
          ? formatName(clazz.name)
          : `${formatName(clazz.name)} [rename: ${formatName(clazz.localName)}]`
      const binding = `${key}: ${propertyType}`
      const { bindings } = unfoldFormatClazz(clazz.rest)
      return { bindings: [binding, ...bindings] }
    }

    case "ClazzFulfilled": {
      const propertyType = formatCore(clazz.propertyType)
      const property = formatCore(clazz.property)
      const key = formatName(clazz.name)
      const binding = `${key}: ${propertyType} = ${property}`
      const { bindings } = unfoldFormatClazz(clazz.rest)
      return { bindings: [binding, ...bindings] }
    }
  }
}

function formatName(name: string): string {
  return isIdentifier(name) ? name : `"${name}"`
}
