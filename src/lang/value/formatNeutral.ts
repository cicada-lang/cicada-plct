import { formatCore } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { readbackNeutral } from "../readback"
import { Solution } from "../solution"

export function formatNeutral(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  neutral: Neutral,
): string {
  try {
    return formatCore(readbackNeutral(mod, ctx, solution, neutral))
  } catch (error) {
    return `[formatNeutral]: fail to readbackNeutral ${neutral.kind}`
  }
}
