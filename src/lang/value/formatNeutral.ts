import { formatCore } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import type { Neutral } from "../neutral/index.js"
import { readbackNeutral } from "../readback/index.js"

export function formatNeutral(mod: Mod, ctx: Ctx, neutral: Neutral): string {
  return formatCore(readbackNeutral(mod, ctx, neutral))
}
