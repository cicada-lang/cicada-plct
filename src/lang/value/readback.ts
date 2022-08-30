import * as Actions from "../actions"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { readbackNeutral } from "../neutral"
import * as Values from "../value"
import { applyClosure, isValue, readbackType, Value } from "../value"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `conversion` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(ctx: Ctx, type: Value, value: Value): Core {
  /**
     Type-directed readback first.
  **/

  switch (type.kind) {
    case "Type": {
      return readbackType(ctx, value)
    }

    case "Pi": {
      /**
         Everything with a `Pi` type is immediately
         `readback` as having a lambda (`Fn`) on top.
         This implements the η-rule for functions.
      **/

      const freshName = isValue(value, Values.Fn)
        ? freshenInCtx(ctx, value.retClosure.name)
        : freshenInCtx(ctx, type.retTypeClosure.name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retValue = Actions.doAp(value, typedNeutral)
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      const retCore = readback(ctx, retTypeValue, retValue)
      return Cores.Fn(freshName, retCore)
    }

    default: {
      /**
         Value-directed readback then.
      **/
    }
  }

  switch (value.kind) {
    case "TypedNeutral": {
      /**
         The `type` and `value.type` are ignored here, maybe we should use them to debug.
      **/

      return readbackNeutral(ctx, value.neutral)
    }

    default: {
      throw new ElaborationError(
        `readback is not implemented for type: ${type.kind}, and value: ${value.kind}`
      )
    }
  }
}
