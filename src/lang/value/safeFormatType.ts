import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readbackType } from "../readback"
import { Value } from "../value"

export function safeFormatType(mod: Mod, ctx: Ctx, type: Value): string {
  try {
    return formatCore(readbackType(mod, ctx, type))
  } catch (error) {
    return `[fail to readbackType] ${type.kind}`
  }
}
