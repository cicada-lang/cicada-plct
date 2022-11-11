import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { readback, readbackProperties, readbackType } from "../readback"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { Value } from "../value"

/**

   # readbackByType

   The eta-rules are implemented here.

   a.k.a. η-rule and eta-expansion.

**/

export function readbackByType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): Core | undefined {
  switch (type.kind) {
    case "Type": {
      return readbackType(mod, ctx, value)
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

    case "Pi": {
      /**
         Everything with a `Pi` type is immediately
         `readback` as having a `Fn` on top.
         This implements the eta-rule for `Fn`.
      **/

      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = applyClosure(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const ret = Actions.doAp(value, v)
      return Cores.Fn(freshName, readback(mod, ctx, retType, ret))
    }

    case "PiImplicit": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = applyClosure(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const ret = Actions.doApImplicit(value, v)
      return Cores.FnImplicit(freshName, readback(mod, ctx, retType, ret))
    }

    case "Sigma": {
      /**
         `Sigma`s are also η-expanded.
         Every value with a `Sigma` type,
         whether it is neutral or not,
         will be `readback` with a `cons` at the top.
      **/

      const car = Actions.doCar(value)
      const cdr = Actions.doCdr(value)
      const cdrType = applyClosure(type.cdrTypeClosure, car)

      return Cores.Cons(
        readback(mod, ctx, type.carType, car),
        readback(mod, ctx, cdrType, cdr),
      )
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return Cores.Objekt(readbackProperties(mod, ctx, type, value))
    }

    default: {
      return undefined
    }
  }
}
