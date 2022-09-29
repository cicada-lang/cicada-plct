import { Core, formatCore } from "../core"

export function unfoldFormatAp(core: Core): {
  target: string
  args: Array<string>
} {
  switch (core.kind) {
    case "Ap": {
      const arg = formatCore(core.arg)
      const { target, args } = unfoldFormatAp(core.target)
      return { target, args: [...args, arg] }
    }

    case "ApImplicit": {
      const arg = `implicit ${formatCore(core.arg)}`
      const { target, args } = unfoldFormatAp(core.target)
      return { target, args: [...args, arg] }
    }

    default: {
      return { target: formatCore(core), args: [] }
    }
  }
}
