import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { readback, readbackType, TypedValue } from "../value"

export function formatTypedValue(ctx: Ctx, typedValue: TypedValue): string {
  const typeCore = readbackType(ctx, typedValue.type)
  const core = readback(ctx, typedValue.type, typedValue.value)
  return `${formatCore(core)}: ${formatCore(typeCore)}`
}
