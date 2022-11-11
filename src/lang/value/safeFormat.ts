import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readback } from "../readback"
import { Value } from "../value"

export function safeFormat(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): string {
  return formatCore(readback(mod, ctx, type, value))
}
