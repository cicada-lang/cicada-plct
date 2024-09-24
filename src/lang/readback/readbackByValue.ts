import * as Actions from "../actions/index.js"
import { closureApply } from "../closure/index.js"
import type { Core } from "../core/index.js"
import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxCons, ctxNames } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import {
  readback,
  readbackNeutral,
  readbackProperties,
  readbackType,
} from "../readback/index.js"
import { solutionNames } from "../solution/index.js"
import { freshen } from "../utils/freshen.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

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

    case "Fn": {
      Values.assertTypeInCtx(mod, ctx, type, "Pi")
      // NOTE Perform partial evaluation.
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = closureApply(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const ret = Actions.doAp(value, v)
      return Cores.Fn(freshName, readback(mod, ctx, retType, ret))
    }

    case "FnImplicit": {
      Values.assertTypeInCtx(mod, ctx, type, "PiImplicit")
      // NOTE Perform partial evaluation.
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, name)
      const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
      const retType = closureApply(type.retTypeClosure, v)
      ctx = CtxCons(freshName, type.argType, ctx)
      const ret = Actions.doApImplicit(value, v)
      return Cores.FnImplicit(freshName, readback(mod, ctx, retType, ret))
    }

    case "Cons": {
      Values.assertTypeInCtx(mod, ctx, type, "Sigma")
      // NOTE Perform partial evaluation.
      const car = Actions.doCar(value)
      const cdr = Actions.doCdr(value)
      const cdrType = closureApply(type.cdrTypeClosure, car)
      return Cores.Cons(
        readback(mod, ctx, type.carType, car),
        readback(mod, ctx, cdrType, cdr),
      )
    }

    case "Quote": {
      return Cores.Quote(value.data)
    }

    case "Sole": {
      return Cores.Var("sole")
    }

    case "Objekt": {
      Values.assertClazzInCtx(mod, ctx, type)
      return Cores.Objekt(readbackProperties(mod, ctx, type, value))
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
