import { Core } from "./Core"
import { Ctx } from "./Ctx"
import { Value } from "./Value"

/**

   # readback

   Type-directed readback.

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `conversion` between values.

**/

export function readback(ctx: Ctx, t: Value, value: Value): Core {
  throw new Error("TODO")
}
