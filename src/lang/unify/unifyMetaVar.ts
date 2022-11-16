import { indent } from "../../utils/indent"
import type { Ctx } from "../ctx"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import { solutionBind } from "../solution"
import { occur } from "../unify"
import type { Value } from "../value"
import * as Values from "../value"
import { formatType, formatValue } from "../value"

export function unifyMetaVar(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  if (
    Values.isMetaVar(left) &&
    Values.isMetaVar(right) &&
    left.neutral.name === right.neutral.name
  ) {
    return "ok"
  }

  if (Values.isMetaVar(left)) {
    if (occur(mod, ctx, left.neutral.name, type, right)) {
      throw new Errors.UnificationError(
        [
          `[unifyMetaVar] find the left name occurs in the right value`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left name: ${left.neutral.name}`),
          indent(`right value: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    solutionBind(mod.solution, left.neutral.name, right)
    return "ok"
  }

  if (Values.isMetaVar(right)) {
    if (occur(mod, ctx, right.neutral.name, type, left)) {
      throw new Errors.UnificationError(
        [
          `[unifyMetaVar] find the right name occurs in the left value`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left value: ${formatValue(mod, ctx, type, left)}`),
          indent(`right name: ${right.neutral.name}`),
        ].join("\n"),
      )
    }

    solutionBind(mod.solution, right.neutral.name, left)
    return "ok"
  }
}
