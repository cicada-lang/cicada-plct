import { Ctx } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { Neutral } from "../neutral"
import { deepWalkTypedValue } from "../solution"

export function deepWalkNeutral(mod: Mod, ctx: Ctx, neutral: Neutral): Neutral {
  switch (neutral.kind) {
    case "Var": {
      return neutral
    }

    case "Ap": {
      return Neutrals.Ap(
        deepWalkNeutral(mod, ctx, neutral.target),
        deepWalkTypedValue(mod, ctx, neutral.arg),
      )
    }

    case "ApImplicit": {
      return neutral
    }

    case "Car": {
      return neutral
    }

    case "Cdr": {
      return neutral
    }

    case "Dot": {
      return neutral
    }
  }
}
