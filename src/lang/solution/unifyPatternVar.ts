import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { occur } from "../solution"
import { Value } from "../value"

export function unifyPatternVar(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  if (
    mod.solution.isPatternVar(left) &&
    mod.solution.isPatternVar(right) &&
    left.neutral.name === right.neutral.name
  ) {
    return "ok"
  }

  if (mod.solution.isPatternVar(left)) {
    if (occur(mod, ctx, left.neutral.name, type, right)) {
      throw new Errors.UnificationError(
        `${left.neutral.name} occurs in ${right.kind}`,
      )
    }

    mod.solution.bindings.set(left.neutral.name, right)
    return "ok"
  }

  if (mod.solution.isPatternVar(right)) {
    if (occur(mod, ctx, right.neutral.name, type, left)) {
      throw new Errors.UnificationError(
        `${right.neutral.name} occurs in ${left.kind}`,
      )
    }

    mod.solution.bindings.set(right.neutral.name, left)
    return "ok"
  }
}
