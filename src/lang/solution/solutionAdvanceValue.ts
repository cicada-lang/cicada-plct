import * as Actions from "../actions"
import type { Mod } from "../mod"
import type { Neutral } from "../neutral"
import { solutionWalk } from "../solution"
import type { Value } from "../value"
import * as Values from "../value"

export function solutionAdvanceValue(mod: Mod, value: Value): Value {
  if (value.kind === "TypedNeutral") {
    return solutionAdvanceNeutral(mod, value.type, value.neutral)
  }

  return value
}

/**

   To prepare for unify is `walk` the meta variable,
   and possibly to further evaluate neutral value.

   For both `walk` and further evaluation,
   only one step is needed, not need to do `deepWalk`.

**/

function solutionAdvanceNeutral(
  mod: Mod,
  type: Value,
  neutral: Neutral,
): Value {
  switch (neutral.kind) {
    case "Var": {
      return Values.TypedNeutral(type, neutral)
    }

    case "MetaVar": {
      const result = solutionWalk(
        mod.solution,
        Values.TypedNeutral(type, neutral),
      )

      if (
        result.kind === "TypedNeutral" &&
        result.neutral.kind === "MetaVar" &&
        result.neutral.name === neutral.name
      ) {
        return result
      } else {
        return solutionAdvanceValue(mod, result)
      }
    }

    case "Ap": {
      return Actions.doAp(
        solutionAdvanceNeutral(mod, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "ApImplicit": {
      return Actions.doApImplicit(
        solutionAdvanceNeutral(mod, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "Car": {
      return Actions.doCar(
        solutionAdvanceNeutral(mod, neutral.targetType, neutral.target),
      )
    }

    case "Cdr": {
      return Actions.doCdr(
        solutionAdvanceNeutral(mod, neutral.targetType, neutral.target),
      )
    }

    case "Dot": {
      // NOTE Dot value fulfilled class `targetType`,
      //   do this in `Actions.doDot` would be too slow.
      if (Values.isClazz(neutral.targetType)) {
        const target = solutionAdvanceNeutral(
          mod,
          neutral.targetType,
          neutral.target,
        )
        const found = Values.clazzLookupProperty(
          target,
          neutral.targetType,
          neutral.name,
        )
        if (found) return solutionAdvanceValue(mod, found)
      }

      return Actions.doDot(
        solutionAdvanceNeutral(mod, neutral.targetType, neutral.target),
        neutral.name,
      )
    }

    case "Replace": {
      return Actions.doReplace(
        solutionAdvanceNeutral(mod, neutral.targetType, neutral.target),
        neutral.motive.value,
        neutral.base.value,
      )
    }
  }
}
