import * as Actions from "../actions"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, isValue, Value } from "../value"

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
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retValue = Actions.doAp(value, typedNeutral)
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
      const freshName = freshenInCtx(ctx, type.retTypeClosure.name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const argTypeCore = readback(ctx, Values.Type(), type.argType)
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retTypeCore = readbackType(ctx, retTypeValue)
      return Cores.Pi(freshName, argTypeCore, retTypeCore)
    }

    default: {
      throw new ElaborationError(
        `readbackType is not implemented for type: ${type.kind}`
      )
    }
  }
}
