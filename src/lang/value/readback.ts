import * as Actions from "../actions"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { readbackNeutral } from "../neutral"
import * as Values from "../value"
import {
  applyClosure,
  assertValue,
  isValue,
  readbackType,
  Value,
} from "../value"
import { readbackObjekt } from "./readbackObjekt"

/**

   # readback

   Note that we view "readback" as one word,
   thus we write `readback` instead of `readBack`.

   We will use `readback` to implement `conversion` between values.

   Be careful about the order of arguments of `readback`,
   first the `type`, then the `value`.

**/

export function readback(ctx: Ctx, type: Value, value: Value): Core {
  return (
    typeDirectedReadback(ctx, type, value) ||
    valueDirectedReadback(ctx, type, value)
  )
}

/**

   # typeDirectedReadback

   The eta-rules are implemented here.

   a.k.a. η-rule and eta-expansion.

**/

export function typeDirectedReadback(
  ctx: Ctx,
  type: Value,
  value: Value
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
        readback(ctx, cdrType, cdrValue)
      )
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      assertValue(value, Values.Objekt)
      return readbackObjekt(ctx, type, value)
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

function valueDirectedReadback(ctx: Ctx, type: Value, value: Value): Core {
  switch (value.kind) {
    case "TypedNeutral": {
      /**
         The `type` and `value.type` are ignored here, maybe we should use them to debug.
      **/

      return readbackNeutral(ctx, value.neutral)
    }

    case "Quote": {
      return Cores.Quote(value.literal)
    }

    default: {
      throw new ElaborationError(
        `readback is not implemented for type: ${type.kind}, and value: ${value.kind}`
      )
    }
  }
}
