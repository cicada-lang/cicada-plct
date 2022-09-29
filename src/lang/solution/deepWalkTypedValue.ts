import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { deepWalk, deepWalkType } from "../solution"
import { TypedValue } from "../value"

export function deepWalkTypedValue(mod: Mod, ctx: Ctx, typedValue: TypedValue): TypedValue {
  const type = deepWalkType(mod, ctx, typedValue.type)
  const value = deepWalk(mod, ctx, typedValue.value)
  return TypedValue(type, value)
}
