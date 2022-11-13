import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readback, readbackType } from "../readback"
import { Solution } from "../solution"
import { TypedValue } from "../value"

export function formatTypedValue(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  typedValue: TypedValue,
): string {
  const typeCore = readbackType(mod, ctx, solution, typedValue.type)
  const core = readback(mod, ctx, solution, typedValue.type, typedValue.value)
  return `${formatCore(core)}: ${formatCore(typeCore)}`
}
