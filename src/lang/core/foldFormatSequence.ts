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

    case "LetThe": {
      const { entries, ret } = foldFormatSequence(core.ret)
      const type = formatCore(core.type)
      const entry = `let ${core.name}: ${type} = ${formatCore(core.core)}`
      return { entries: [entry, ...entries], ret }
    }

    case "Check": {
      const { entries, ret } = foldFormatSequence(core.ret)
      const type = formatCore(core.type)
      const entry = `check ${type}: ${formatCore(core.core)}`
      return { entries: [entry, ...entries], ret }
    }

    default: {
      return { entries: [], ret: formatCore(core) }
    }
  }
}
