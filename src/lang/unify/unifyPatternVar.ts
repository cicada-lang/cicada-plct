import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { isPatternVar } from "../solution"
import { occur } from "../unify"
import { formatType, formatValue, Value } from "../value"

export function unifyPatternVar(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  if (
    isPatternVar(mod.solution, left) &&
    isPatternVar(mod.solution, right) &&
    left.neutral.name === right.neutral.name
  ) {
    return "ok"
  }

  if (isPatternVar(mod.solution, left)) {
    if (occur(mod, ctx, left.neutral.name, type, right)) {
      throw new Errors.UnificationError(
        [
          `[unifyPatternVar] find the left name occurs in the right value`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left name: ${left.neutral.name}`),
          indent(`right value: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    mod.solution.bindings.set(left.neutral.name, right)
    return "ok"
  }

  if (isPatternVar(mod.solution, right)) {
    if (occur(mod, ctx, right.neutral.name, type, left)) {
      throw new Errors.UnificationError(
        [
          `[unifyPatternVar] find the right name occurs in the left value`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left value: ${formatValue(mod, ctx, type, left)}`),
          indent(`right name: ${right.neutral.name}`),
        ].join("\n"),
      )
    }

    mod.solution.bindings.set(right.neutral.name, left)
    return "ok"
  }
}
