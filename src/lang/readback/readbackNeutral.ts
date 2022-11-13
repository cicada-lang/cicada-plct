import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { readback } from "../readback"
import { Solution } from "../solution"

export function readbackNeutral(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  neutral: Neutral,
): Core {
  switch (neutral.kind) {
    case "Var": {
      return Cores.Var(neutral.name)
    }

    case "Ap": {
      return Cores.Ap(
        readbackNeutral(mod, ctx, solution, neutral.target),
        readback(mod, ctx, solution, neutral.arg.type, neutral.arg.value),
      )
    }

    case "ApImplicit": {
      return Cores.ApImplicit(
        readbackNeutral(mod, ctx, solution, neutral.target),
        readback(mod, ctx, solution, neutral.arg.type, neutral.arg.value),
      )
    }

    case "Car": {
      return Cores.Car(readbackNeutral(mod, ctx, solution, neutral.target))
    }

    case "Cdr": {
      return Cores.Cdr(readbackNeutral(mod, ctx, solution, neutral.target))
    }

    case "Dot": {
      return Cores.Dot(
        readbackNeutral(mod, ctx, solution, neutral.target),
        neutral.name,
      )
    }

    case "Replace": {
      const target = readbackNeutral(mod, ctx, solution, neutral.target)
      const motive = readback(
        mod,
        ctx,
        solution,
        neutral.motive.type,
        neutral.motive.value,
      )
      const base = readback(
        mod,
        ctx,
        solution,
        neutral.base.type,
        neutral.base.value,
      )
      return Cores.Replace(target, motive, base)
    }
  }
}
