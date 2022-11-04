import { Core } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { advanceValue } from "../solution"
import { readbackByType, readbackByValue, Value } from "../value"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `conversion` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(mod: Mod, ctx: Ctx, type: Value, value: Value): Core {
  type = advanceValue(mod.solution, type)
  value = advanceValue(mod.solution, value)

  return (
    readbackByType(mod, ctx, type, value) ||
    readbackByValue(mod, ctx, type, value)
  )
}
