import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
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
        readback(ctx, neutral.arg.type, neutral.arg.value),
      )
    }

    case "Car": {
      return Cores.Car(readbackNeutral(ctx, neutral.target))
    }

    case "Cdr": {
      return Cores.Cdr(readbackNeutral(ctx, neutral.target))
    }

    case "Dot": {
      return Cores.Dot(readbackNeutral(ctx, neutral.target), neutral.name)
    }
  }
}
