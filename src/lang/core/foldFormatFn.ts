import { Core, formatCore } from "../core"

export function foldFormatFn(core: Core): {
  bindings: Array<string>
  ret: string
} {
  switch (core.kind) {
    case "Fn": {
      const binding = `${core.name}`
      const { bindings, ret } = foldFormatFn(core.ret)
      return { bindings: [binding, ...bindings], ret }
    }

    case "ImplicitFn": {
      const binding = `implicit ${core.name}`
      const { bindings, ret } = foldFormatFn(core.ret)
      return { bindings: [binding, ...bindings], ret }
    }

    default: {
      return { bindings: [], ret: formatCore(core) }
    }
  }
}
