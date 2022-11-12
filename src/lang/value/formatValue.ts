import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readback } from "../readback"
import { Value } from "../value"

export function formatValue(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): string {
  try {
    return formatCore(readback(mod, ctx, type, value))
  } catch (error) {
    return `[fail to readback] ${value.kind}`
  }
}
