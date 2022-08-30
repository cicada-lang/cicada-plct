import { Core } from "../core"
import * as Cores from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Neutral } from "./Neutral"

export function readbackNeutral(ctx: Ctx, neutral: Neutral): Core {
  switch (neutral.kind) {
    case "Var": {
      return Cores.Var(neutral.name)
    }

    default: {
      throw new ElaborationError(
        `readbackNeutral is not implemented for ${neutral.kind}`
      )
    }
  }
}
