import * as Actions from "../actions"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { Solution, solutionWalk } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function solutionAdvanceValue(
  mod: Mod,
  solution: Solution,
  value: Value,
): Value {
  if (value.kind === "TypedNeutral") {
    return advanceNeutral(mod, solution, value.type, value.neutral)
  }

  return value
}

/**

   To prepare for unify is `walk` the pattern variable,
   and possibly to further evaluate neutral value.

   For both `walk` and further evaluation,
   only one step is needed, not need to do `deepWalk`.

**/

function advanceNeutral(
  mod: Mod,
  solution: Solution,
  type: Value,
  neutral: Neutral,
): Value {
  switch (neutral.kind) {
    case "Var": {
      return solutionWalk(solution, Values.TypedNeutral(type, neutral))
    }

    case "Ap": {
      return Actions.doAp(
        advanceNeutral(mod, solution, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "ApImplicit": {
      return Actions.doApImplicit(
        advanceNeutral(mod, solution, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "Car": {
      return Actions.doCar(
        advanceNeutral(mod, solution, neutral.targetType, neutral.target),
      )
    }

    case "Cdr": {
      return Actions.doCdr(
        advanceNeutral(mod, solution, neutral.targetType, neutral.target),
      )
    }

    case "Dot": {
      return Actions.doDot(
        advanceNeutral(mod, solution, neutral.targetType, neutral.target),
        neutral.name,
      )
    }

    case "Replace": {
      return Actions.doReplace(
        advanceNeutral(mod, solution, neutral.targetType, neutral.target),
        neutral.motive.value,
        neutral.base.value,
      )
    }
  }
}
