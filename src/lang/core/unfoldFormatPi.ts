import { Core, formatCore } from "../core"

export function unfoldFormatPi(core: Core): {
  bindings: Array<string>
  retType: string
} {
  switch (core.kind) {
    case "Pi": {
      const argType = formatCore(core.argType)
      const binding = `${core.name}: ${argType}`
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
