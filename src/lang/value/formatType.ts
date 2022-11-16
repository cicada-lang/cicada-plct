import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readbackType } from "../readback"
import { Value } from "../value"

export function formatType(mod: Mod, ctx: Ctx, type: Value): string {
  return formatCore(readbackType(mod, ctx, type))
}
