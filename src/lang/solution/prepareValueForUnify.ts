import * as Actions from "../actions"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function prepareValueForUnify(solution: Solution, value: Value): Value {
  if (value.kind === "TypedNeutral") {
    return prepareNeutralForUnify(solution, value.type, value.neutral)
  }

  return value
}

/**

   To prepare for unify is `walk` the pattern variable,
   and possibly to further evaluate neutral value.

   For both `walk` and further evaluation,
   only one step is needed, not need to do `deepWalk`.

**/

function prepareNeutralForUnify(
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
        prepareNeutralForUnify(solution, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "ApImplicit": {
      return Actions.doApImplicit(
        prepareNeutralForUnify(solution, neutral.targetType, neutral.target),
        neutral.arg.value,
      )
    }

    case "Car": {
      return Actions.doCar(
        prepareNeutralForUnify(solution, neutral.targetType, neutral.target),
      )
    }

    case "Cdr": {
      return Actions.doCdr(
        prepareNeutralForUnify(solution, neutral.targetType, neutral.target),
      )
    }

    case "Dot": {
      return Actions.doDot(
        prepareNeutralForUnify(solution, neutral.targetType, neutral.target),
        neutral.name,
      )
    }

    case "Replace": {
      return Actions.doReplace(
        prepareNeutralForUnify(solution, neutral.targetType, neutral.target),
        neutral.motive.value,
        neutral.base.value,
      )
    }
  }
}
