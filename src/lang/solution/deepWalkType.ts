import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { deepWalk } from "../solution"
import { Value } from "../value"

export function deepWalkType(mod: Mod, ctx: Ctx, type: Value): Value {
  return deepWalk(mod, ctx, type)
}
