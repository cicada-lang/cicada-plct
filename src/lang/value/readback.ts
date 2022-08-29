import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Globals from "../globals"
import { Value } from "./Value"

/**

   # readback

   Type-directed readback.

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `conversion` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(ctx: Ctx, type: Value, value: Value): Core {
  throw new Error("TODO")
}

export function readbackType(ctx: Ctx, type: Value): Core {
  return readback(ctx, Globals.Type, type)
}
