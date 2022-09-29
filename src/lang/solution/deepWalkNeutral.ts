import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"

export function deepWalkNeutral(mod: Mod, ctx: Ctx, neutral: Neutral): Neutral {
  switch (neutral.kind) {
    case "Var": {
      return neutral
    }

    case "Ap": {
      return neutral
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
