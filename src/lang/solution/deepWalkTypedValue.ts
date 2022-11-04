import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { deepWalk } from "../solution"
import { TypedValue } from "../value"

export function deepWalkTypedValue(
  mod: Mod,
  ctx: Ctx,
  typedValue: TypedValue,
): TypedValue {
  const value = deepWalk(mod, ctx, typedValue.type, typedValue.value)
  return TypedValue(typedValue.type, value)
}
