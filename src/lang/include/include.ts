import { indent } from "../../utils/indent"
import { closureApply } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { equivalent, equivalentType } from "../equivalent"
import * as Errors from "../errors"
import { includeClazz } from "../include"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import type { Value } from "../value"
import * as Values from "../value"

/**

   # Subtyping

   We use the word `include` to name our function
   which implements the subtyping relation.

   Comparing it with the word `equivalent`
   for equivalent relation between types.

   `include` is like `equivalent` but applies only to types,
   and also handles subtyping between classes,
   -- simple attribute based subtype relation.

   `equivalent` is implemented by `readback` and `alphaEquivalent`,

   We will not implement `Union` and `Intersection` types.

   We only use tagged union (sum type in ADT),
   -- which will be implemented by our induction datatypes.

**/

export function include(mod: Mod, ctx: Ctx, type: Value, subtype: Value): void {
  try {
    includeAux(mod, ctx, type, subtype)
  } catch (error) {
    if (error instanceof Errors.InclusionError) {
      error.trace.unshift(
        [
          `[include]`,
          indent(`subtype: ${Values.formatType(mod, ctx, subtype)}`),
          indent(`type: ${Values.formatType(mod, ctx, type)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}

export function includeAux(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  subtype: Value,
): void {
  if (subtype.kind === "Pi" && type.kind === "Pi") {
    /**
       Contravariant in argument position.

       The order of type and subtype is swapped
       in the following recursive call to `include`.
    **/

    include(mod, ctx, subtype.argType, type.argType)
    const name = subtype.retTypeClosure.name
    const argType = subtype.argType
    const usedNames = ctxNames(ctx)
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(argType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, argType, ctx)
    include(
      mod,
      ctx,
      closureApply(type.retTypeClosure, v),
      closureApply(subtype.retTypeClosure, v),
    )
    return
  }

  if (subtype.kind === "Sigma" && type.kind === "Sigma") {
    include(mod, ctx, type.carType, subtype.carType)
    const name = subtype.cdrTypeClosure.name
    const carType = subtype.carType
    const usedNames = ctxNames(ctx)
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(carType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, carType, ctx)
    include(
      mod,
      ctx,
      closureApply(type.cdrTypeClosure, v),
      closureApply(subtype.cdrTypeClosure, v),
    )
    return
  }

  if (Values.isClazz(subtype) && Values.isClazz(type)) {
    includeClazz(mod, ctx, type, subtype)
    return
  }

  if (subtype.kind === "Equal" && type.kind === "Equal") {
    include(mod, ctx, type.type, subtype.type)
    equivalent(mod, ctx, type.type, type.from, subtype.from)
    equivalent(mod, ctx, type.type, type.to, subtype.to)
    return
  }

  equivalentType(mod, ctx, type, subtype)
}
