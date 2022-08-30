import { Core } from "./Core"
import { EvaluationError } from "../errors"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    default: {
      throw new EvaluationError(`formatCore is not implemented for ${core.kind}`)
    }
  }
}
