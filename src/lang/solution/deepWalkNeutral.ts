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
      return Neutrals.ApImplicit(
        deepWalkNeutral(mod, ctx, neutral.target),
        deepWalkTypedValue(mod, ctx, neutral.arg),
      )
    }

    case "Car": {
      return Neutrals.Car(deepWalkNeutral(mod, ctx, neutral.target))
    }

    case "Cdr": {
      return Neutrals.Cdr(deepWalkNeutral(mod, ctx, neutral.target))
    }

    case "Dot": {
      return Neutrals.Dot(deepWalkNeutral(mod, ctx, neutral.target), neutral.name)
    }
  }
}
