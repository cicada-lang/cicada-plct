import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { readbackByType, readbackByValue } from "../readback/index.js"
import { solutionAdvanceValue } from "../solution/index.js"
import type { Value } from "../value/index.js"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `equivalent` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(mod: Mod, ctx: Ctx, type: Value, value: Value): Core {
  type = solutionAdvanceValue(mod, type)
  value = solutionAdvanceValue(mod, value)

  return (
    readbackByType(mod, ctx, type, value) ||
    readbackByValue(mod, ctx, type, value)
  )
}
