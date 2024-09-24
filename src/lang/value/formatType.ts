import { formatCore } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { readbackType } from "../readback/index.js"
import type { Value } from "../value/index.js"

export function formatType(mod: Mod, ctx: Ctx, type: Value): string {
  return formatCore(readbackType(mod, ctx, type))
}
