import { formatCore } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { readback, readbackType } from "../readback/index.js"
import type { TypedValue } from "../value/index.js"

export function formatTypedValue(
  mod: Mod,
  ctx: Ctx,
  typedValue: TypedValue,
): string {
  const typeCore = readbackType(mod, ctx, typedValue.type)
  const core = readback(mod, ctx, typedValue.type, typedValue.value)
  return `${formatCore(core)}: ${formatCore(typeCore)}`
}
