import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readbackType } from "../readback"
import { Solution } from "../solution"
import { Value } from "../value"

export function formatType(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  type: Value,
): string {
  try {
    return formatCore(readbackType(mod, ctx, solution, type))
  } catch (error) {
    return `[formatType] fail to readbackType: ${type.kind}`
  }
}
