import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Value } from "../value"

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

  switch (type.kind) {
    case "Type": {
      return readbackType(ctx, value)
    }

    default: {
      // Value-directed readback then.
    }
  }

  switch (value.kind) {
    default: {
      throw new ElaborationError(
        `readback is not implemented for type: ${type.kind}, and value: ${value.kind}`
      )
    }
  }
}

export function readbackType(ctx: Ctx, type: Value): Core {
  switch (type.kind) {
    case "Type": {
      /**

         TODO Maybe a scope bug.

         let U = Type

         function f(Type: (Type) -> Type) {

         // In this scope,
         // `U` is `readback` to `Cores.Var("Type")`,
         // `Type` is also `readback` to `Cores.Var("Type")`,
         // but they should not be equal.

         // (If we implement equal by NbE.)

         }

       **/
      return Cores.Var("Type")
    }

    case "Pi": {
    }

    default: {
      throw new ElaborationError(
        `readbackType is not implemented for type: ${type.kind}`
      )
    }
  }
}
