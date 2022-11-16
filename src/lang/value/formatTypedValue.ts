import { formatCore } from "../core"
import type { Ctx } from "../ctx"
import type { Mod } from "../mod"
import { readback, readbackType } from "../readback"
import type { TypedValue } from "../value"

export function formatTypedValue(
  mod: Mod,
  ctx: Ctx,
  typedValue: TypedValue,
): string {
  const typeCore = readbackType(mod, ctx, typedValue.type)
  const core = readback(mod, ctx, typedValue.type, typedValue.value)
  return `${formatCore(core)}: ${formatCore(typeCore)}`
}
