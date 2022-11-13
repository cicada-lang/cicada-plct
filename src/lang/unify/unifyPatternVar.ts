import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { isPatternVar, Solution, solutionBind } from "../solution"
import { occur } from "../unify"
import { formatType, formatValue, Value } from "../value"

export function unifyPatternVar(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  type: Value,
  left: Value,
  right: Value,
): Solution | undefined {
  if (
    isPatternVar(solution, left) &&
    isPatternVar(solution, right) &&
    left.neutral.name === right.neutral.name
  ) {
    return solution
  }

  if (isPatternVar(solution, left)) {
    if (occur(mod, ctx, solution, left.neutral.name, type, right)) {
      throw new Errors.UnificationError(
        [
          `[unifyPatternVar] find the left name occurs in the right value`,
          indent(`type: ${formatType(mod, ctx, solution, type)}`),
          indent(`left name: ${left.neutral.name}`),
          indent(
            `right value: ${formatValue(mod, ctx, solution, type, right)}`,
          ),
        ].join("\n"),
      )
    }

    return solutionBind(solution, left.neutral.name, right)
  }

  if (isPatternVar(solution, right)) {
    if (occur(mod, ctx, solution, right.neutral.name, type, left)) {
      throw new Errors.UnificationError(
        [
          `[unifyPatternVar] find the right name occurs in the left value`,
          indent(`type: ${formatType(mod, ctx, solution, type)}`),
          indent(`left value: ${formatValue(mod, ctx, solution, type, left)}`),
          indent(`right name: ${right.neutral.name}`),
        ].join("\n"),
      )
    }

    return solutionBind(solution, right.neutral.name, left)
  }
}
