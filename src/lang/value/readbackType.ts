import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { ElaborationError } from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { readbackClazz, readbackNeutral, Value } from "../value"

/**

   TODO Maybe a scope bug.

   Take Type as a example.

   let U = Type

   function f(Type: (Type) -> Type) {
   // Problem: In this scope,
   // `U` is `readback` to `Cores.Var("Type")`,
   // `Type` is also `readback` to `Cores.Var("Type")`,
   // but they should not be equal (if we implement equal by NbE).

   // Solution: `Type` should not be `readback` to `Cores.Var("Type")`.
   }

**/

export function readbackType(mod: Mod, ctx: Ctx, type: Value): Core {
  switch (type.kind) {
    case "TypedNeutral": {
      /**
         The `type` in `TypedNeutral` are not used.
      **/
      return readbackNeutral(mod, ctx, type.neutral)
    }

    case "Type": {
      return Cores.Var("Type")
    }

    case "String": {
      return Cores.Var("String")
    }

    case "Trivial": {
      return Cores.Var("Trivial")
    }

    case "Pi": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const argTypeCore = readbackType(mod, ctx, type.argType)
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retTypeValue)
      return Cores.Pi(freshName, argTypeCore, retTypeCore)
    }

    case "PiImplicit": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const argTypeCore = readbackType(mod, ctx, type.argType)
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retTypeValue)
      return Cores.PiImplicit(freshName, argTypeCore, retTypeCore)
    }

    case "Sigma": {
      const name = type.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.carType, variable)
      const carTypeCore = readbackType(mod, ctx, type.carType)
      const cdrTypeValue = applyClosure(type.cdrTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrTypeValue)
      return Cores.Sigma(freshName, carTypeCore, cdrTypeCore)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return readbackClazz(mod, ctx, type)
    }

    default: {
      throw new ElaborationError(
        `readbackType is not implemented for type: ${type.kind}`,
      )
    }
  }
}
