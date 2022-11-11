import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { readbackNeutral } from "../readback"

export function safeFormatNeutral(
  mod: Mod,
  ctx: Ctx,
  neutral: Neutral,
): string {
  try {
    return formatCore(readbackNeutral(mod, ctx, neutral))
  } catch (error) {
    return `[fail to readbackNeutral] ${neutral.kind}`
  }
}
