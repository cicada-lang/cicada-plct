import { formatCore } from "../core"
import type { Ctx } from "../ctx"
import { Mod } from "../mod"
import type { Neutral } from "../neutral"
import { readbackNeutral } from "../readback"

export function formatNeutral(mod: Mod, ctx: Ctx, neutral: Neutral): string {
  return formatCore(readbackNeutral(mod, ctx, neutral))
}
