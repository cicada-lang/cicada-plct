import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { readback, readbackNeutral, readbackType } from "../readback"
import { Solution } from "../solution"
import { Value } from "../value"

export function readbackByValue(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  type: Value,
  value: Value,
): Core {
  switch (value.kind) {
    case "TypedNeutral": {
      /**
         The `type` in `TypedNeutral` are not used.
      **/

      return readbackNeutral(mod, ctx, solution, value.neutral)
    }

    case "Quote": {
      return Cores.Quote(value.data)
    }

    case "Refl": {
      return Cores.ApImplicit(
        Cores.ApImplicit(
          Cores.Var("refl"),
          readbackType(mod, ctx, solution, value.type),
        ),
        readback(mod, ctx, solution, value.type, value.value),
      )
    }

    default: {
      throw new Errors.ReadbackError(
        `readbackByValue is not implemented for type: ${type.kind}, and value: ${value.kind}`,
      )
    }
  }
}
