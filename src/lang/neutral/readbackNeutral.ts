import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { readback } from "../value"
import { Neutral } from "./Neutral"

export function readbackNeutral(ctx: Ctx, neutral: Neutral): Core {
  switch (neutral.kind) {
    case "Var": {
      return Cores.Var(neutral.name)
    }

    case "Ap": {
      return Cores.Ap(
        readbackNeutral(ctx, neutral.target),
        readback(ctx, neutral.arg.type, neutral.arg.value)
      )
    }

    // default: {
    //   throw new ElaborationError(
    //     `readbackNeutral is not implemented for ${neutral.kind}`
    //   )
    // }
  }
}
