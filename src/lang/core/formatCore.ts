import { Core } from "./Core"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    default: {
      throw new Error(`formatCore is not implemented for ${core.kind}`)
    }
  }
}
