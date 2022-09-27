import { Ctx } from "../ctx"
import { Solution, unify, unifyType } from "../solution"
import { TypedValue } from "../value"

export function unifyTypedValue(
  solution: Solution,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): void {
  unifyType(solution, ctx, left.type, right.type)
  unify(solution, ctx, left.type, left.value, right.value)
}
