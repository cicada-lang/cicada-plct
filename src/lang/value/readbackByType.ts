import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import {
  isValue,
  readback,
  readbackProperties,
  readbackType,
  Value,
} from "../value"

/**

   # readbackByType

   The eta-rules are implemented here.

   a.k.a. η-rule and eta-expansion.

**/

export function readbackByType(
  ctx: Ctx,
  type: Value,
  value: Value,
): Core | undefined {
  switch (type.kind) {
    case "Type": {
      return readbackType(ctx, value)
    }

    case "Pi": {
      /**
         Everything with a `Pi` type is immediately
         `readback` as having a `Fn` on top.
         This implements the eta-rule for `Fn`.
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

    case "Sigma": {
      /**
         `Sigma`s are also η-expanded.
         Every value with a `Sigma` type,
         whether it is neutral or not,
         will be `readback` with a `cons` at the top.
      **/

      const carValue = Actions.doCar(value)
      const cdrValue = Actions.doCdr(value)
      const cdrType = applyClosure(type.cdrTypeClosure, carValue)

      return Cores.Cons(
        readback(ctx, type.carType, carValue),
        readback(ctx, cdrType, cdrValue),
      )
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return Cores.Objekt(readbackProperties(ctx, type, value))
    }

    case "Trivial": {
      /**
         The η-rule for `Trivial` states that,
         all of its inhabitants are the same as `sole`.
         This is implemented by reading all the
         values of type `Trivial` back to `sole`,
         even the value is `TypedNeutral`.
      **/

      return Cores.Var("sole")
    }

    default: {
      return undefined
    }
  }
}
