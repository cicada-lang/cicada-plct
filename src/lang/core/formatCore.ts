import { EvaluationError } from "../errors"
import { Core } from "./Core"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    case "Pi": {
      const argType = formatCore(core.argType)
      const retType = formatCore(core.retType)
      return `(${core.name}: ${argType}) -> ${retType}`
    }

    case "Fn": {
      const ret = formatCore(core.ret)
      return `(${core.name}) => ${ret}`
    }

    default: {
      throw new EvaluationError(
        `formatCore is not implemented for ${core.kind}`
      )
    }
  }
}
