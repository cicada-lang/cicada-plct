import type { Core } from "../core"
import * as Cores from "../core"
import type { Ctx } from "../ctx"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import { readback, readbackNeutral, readbackType } from "../readback"
import type { Value } from "../value"

export function readbackByValue(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): Core {
  switch (value["@kind"]) {
    case "TypedNeutral": {
      /**
         The `type` in `TypedNeutral` are not used.
      **/

      return readbackNeutral(mod, ctx, value.neutral)
    }

    case "Quote": {
      return Cores.Quote(value.data)
    }

    case "Refl": {
      return Cores.ApImplicit(
        Cores.ApImplicit(Cores.Var("refl"), readbackType(mod, ctx, value.type)),
        readback(mod, ctx, value.type, value.value),
      )
    }

    default: {
      throw new Errors.ReadbackError(
        [
          `[readbackByValue] is not implemented for`,
          `  type["@kind"]: ${type["@kind"]}`,
          `  value["@kind"]: ${value["@kind"]}`,
        ].join("\n"),
      )
    }
  }
}
