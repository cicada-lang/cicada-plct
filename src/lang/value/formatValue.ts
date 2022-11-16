import { formatCore } from "../core"
import type { Ctx } from "../ctx"
import type { Mod } from "../mod"
import { readback } from "../readback"
import type { Value } from "../value"

export function formatValue(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): string {
  return formatCore(readback(mod, ctx, type, value))
}
