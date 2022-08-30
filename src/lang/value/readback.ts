import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Values from "./Value"
import { Value } from "./Value"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `conversion` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(ctx: Ctx, type: Value, value: Value): Core {
  // Type-directed readback first.

  // TODO

  // Value-directed readback then.

  switch (value.kind) {
    default: {
      throw new ElaborationError(
        `readback is not implemented for type: ${type.kind}, and value: ${value.kind}`
      )
    }
  }
}

export function readbackType(ctx: Ctx, type: Value): Core {
  return readback(ctx, Values.Type(), type)
}
