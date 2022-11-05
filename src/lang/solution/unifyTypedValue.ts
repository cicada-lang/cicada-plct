import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { unify, unifyType } from "../solution"
import { TypedValue } from "../value"

export function unifyTypedValue(
  mod: Mod,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): void {
  unifyType(mod, ctx, left.type, right.type)
  unify(mod, ctx, left.type, left.value, right.value)
}
