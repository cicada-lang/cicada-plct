import * as Actions from "../actions"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function advanceValue(solution: Solution, value: Value): Value {
  if (value.kind === "TypedNeutral") {
    return advanceNeutral(solution, value.type, value.neutral)
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
  solution: Solution,
  type: Value,
  neutral: Neutral,
): Value {
  switch (neutral.kind) {
    case "Var": {
      return solution.walk(Values.TypedNeutral(type, neutral))
    }

    case "Ap": {
      return Actions.doAp(
        advanceNeutral(solution, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "ApImplicit": {
      return Actions.doApImplicit(
        advanceNeutral(solution, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "Car": {
      return Actions.doCar(
        advanceNeutral(solution, neutral.targetType, neutral.target),
      )
    }

    case "Cdr": {
      return Actions.doCdr(
        advanceNeutral(solution, neutral.targetType, neutral.target),
      )
    }

    case "Dot": {
      return Actions.doDot(
        advanceNeutral(solution, neutral.targetType, neutral.target),
        neutral.name,
      )
    }

    case "Replace": {
      return Actions.doReplace(
        advanceNeutral(solution, neutral.targetType, neutral.target),
        neutral.motive.value,
        neutral.base.value,
      )
    }
  }
}
