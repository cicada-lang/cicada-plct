import { Ctx } from "../ctx"
import {
  prepareValueForUnify,
  Solution,
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
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  left = prepareValueForUnify(solution, left)
  right = prepareValueForUnify(solution, right)

  if (unifyPatternVar(solution, ctx, type, left, right)) return
  if (unifyByType(solution, ctx, type, left, right)) return

  unifyByValue(solution, ctx, type, left, right)
}
