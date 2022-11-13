import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readback } from "../readback"
import { Solution } from "../solution"
import { Value } from "../value"

export function formatValue(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  type: Value,
  value: Value,
): string {
  try {
    return formatCore(readback(mod, ctx, solution, type, value))
  } catch (error) {
    return `[formatValue] fail to readback: ${value.kind}`
  }
}
