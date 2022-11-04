import * as Actions from "../actions"
import { Ctx } from "../ctx"
import { Neutral } from "../neutral"
import {
  Solution,
  unifyByType,
  unifyByValue,
  unifyPatternVar,
} from "../solution"
import * as Values from "../value"
import { Value } from "../value"

/**

   # unify

   `unify` will be used during elaboration (`check` and `infer`),
   to support features like `PiImplicit`.

   The recursion structure of `unify` closely follows `readback`,
   but dealing with two values in each step.

**/

export function unify(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  left = prepareValue(solution, left)
  right = prepareValue(solution, right)

  if (unifyPatternVar(solution, ctx, type, left, right)) return
  if (unifyByType(solution, ctx, type, left, right)) return

  unifyByValue(solution, ctx, type, left, right)
}

export function prepareValue(solution: Solution, value: Value): Value {
  if (value.kind === "TypedNeutral") {
    return prepareNeutral(solution, value.type, value.neutral)
  }

  return value
}

function prepareNeutral(
  solution: Solution,
  type: Value,
  neutral: Neutral,
): Value {
  switch (neutral.kind) {
    case "Var": {
      return solution.walk(Values.TypedNeutral(type, neutral))
    }

    case "Ap": {
      const target = prepareNeutral(
        solution,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doAp(target, neutral.arg.value)
    }

    case "ApImplicit": {
      const target = prepareNeutral(
        solution,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doApImplicit(target, neutral.arg.value)
    }

    case "Car": {
      const target = prepareNeutral(
        solution,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doCar(target)
    }

    case "Cdr": {
      const target = prepareNeutral(
        solution,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doCdr(target)
    }

    case "Dot": {
      const target = prepareNeutral(
        solution,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doDot(target, neutral.name)
    }

    case "Replace": {
      const target = prepareNeutral(
        solution,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doReplace(target, neutral.motive.value, neutral.base.value)
    }
  }
}
