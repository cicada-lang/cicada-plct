import { Core, formatCore } from "../core"

export function foldFormatSequence(core: Core): {
  entries: Array<string>
  ret: string
} {
  switch (core.kind) {
    default: {
      return { entries: [], ret: formatCore(core) }
    }
  }
}
