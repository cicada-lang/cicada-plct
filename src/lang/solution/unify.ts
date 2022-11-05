import { Ctx } from "../ctx"
import { Mod } from "../mod"
import {
  advanceValue,
  unifyByType,
  unifyByValue,
  unifyPatternVar,
} from "../solution"
import { Value } from "../value"

/**

   # unify

   `unify` will be used during elaboration (`check` and `infer`),
   to support features like `PiImplicit`.

   The recursion structure of `unify` closely follows `readback`,
   but dealing with two values in each step.

**/

export function unify(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  type = advanceValue(mod, type)
  left = advanceValue(mod, left)
  right = advanceValue(mod, right)

  if (unifyPatternVar(mod, ctx, type, left, right)) return
  if (unifyByType(mod, ctx, type, left, right)) return

  unifyByValue(mod, ctx, type, left, right)
}
