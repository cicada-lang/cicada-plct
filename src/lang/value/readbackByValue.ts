import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { readbackNeutral, Value } from "../value"

export function readbackByValue(mod: Mod, ctx: Ctx, type: Value, value: Value): Core {
  switch (value.kind) {
    case "TypedNeutral": {
      /**
         The `type` in `TypedNeutral` are not used.
      **/

      return readbackNeutral(mod, ctx, value.neutral)
    }

    case "Quote": {
      return Cores.Quote(value.data)
    }

    default: {
      throw new Errors.ElaborationError(
        `readbackByValue is not implemented for type: ${type.kind}, and value: ${value.kind}`,
      )
    }
  }
}
