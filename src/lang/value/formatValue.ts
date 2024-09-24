import { formatCore } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { readback } from "../readback/index.js"
import type { Value } from "../value/index.js"

export function formatValue(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): string {
  return formatCore(readback(mod, ctx, type, value))
}
