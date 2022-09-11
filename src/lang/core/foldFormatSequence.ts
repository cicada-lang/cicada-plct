import { Core, formatCore } from "../core"

export function foldFormatSequence(core: Core): {
  entries: Array<string>
  ret: string
} {
  switch (core.kind) {
    case "Let": {
      const { entries, ret } = foldFormatSequence(core.ret)
      const entry = `let ${core.name} = ${formatCore(core.core)}`
      return { entries: [entry, ...entries], ret }
    }

    default: {
      return { entries: [], ret: formatCore(core) }
    }
  }
}
