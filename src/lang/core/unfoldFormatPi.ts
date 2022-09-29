import * as Cores from "../core"
import { Core, formatCore } from "../core"

export function unfoldFormatPi(core: Core): {
  bindings: Array<string>
  retType: string
} {
  switch (core.kind) {
    case "Pi": {
      const retTypefreeNames = Cores.freeNames(new Set(), core.retType)
      const argType = formatCore(core.argType)
      const binding = retTypefreeNames.has(core.name) ? `${core.name}: ${argType}` : `${argType}`
      const { bindings, retType } = unfoldFormatPi(core.retType)
      return { bindings: [binding, ...bindings], retType }
    }

    case "PiImplicit": {
      const argType = formatCore(core.argType)
      const binding = `implicit ${core.name}: ${argType}`
      const { bindings, retType } = unfoldFormatPi(core.retType)
      return { bindings: [binding, ...bindings], retType }
    }

    default: {
      return { bindings: [], retType: formatCore(core) }
    }
  }
}
