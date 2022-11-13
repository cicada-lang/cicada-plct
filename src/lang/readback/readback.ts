import { Core } from "../core"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { readbackByType, readbackByValue } from "../readback"
import { Solution, solutionAdvanceValue } from "../solution"
import { Value } from "../value"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `equivalent` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  type: Value,
  value: Value,
): Core {
  type = solutionAdvanceValue(mod, solution, type)
  value = solutionAdvanceValue(mod, solution, value)

  return (
    readbackByType(mod, ctx, solution, type, value) ||
    readbackByValue(mod, ctx, solution, type, value)
  )
}
