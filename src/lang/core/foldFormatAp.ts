import { Core, formatCore } from "../core"

export function foldFormatAp(core: Core): {
  target: string
  args: Array<string>
} {
  switch (core.kind) {
    case "Ap": {
      const arg = formatCore(core.arg)
      const { target, args } = foldFormatAp(core.target)
      return { target, args: [...args, arg] }
    }

    default: {
      return { target: formatCore(core), args: [] }
    }
  }
}
