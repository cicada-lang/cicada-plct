import { indent } from "../../utils/indent"
import { applyClosure } from "../closure"
import { formatCore } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { advanceValue, unify, unifyType } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { includeClazz, readbackType, Value } from "../value"

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

export function include(mod: Mod, ctx: Ctx, subtype: Value, type: Value): void {
  subtype = advanceValue(mod, subtype)
  type = advanceValue(mod, type)

  try {
    includeAux(mod, ctx, subtype, type)
  } catch (error) {
    if (error instanceof Errors.InclusionError) {
      error.trace.unshift(
        [
          `[include]`,
          indent(`subtype: ${formatCore(readbackType(mod, ctx, subtype))}`),
          indent(`type: ${formatCore(readbackType(mod, ctx, type))}`),
        ].join("\n"),
      )
    }

    throw error
  }
}

export function includeAux(
  mod: Mod,
  ctx: Ctx,
  subtype: Value,
  type: Value,
): void {
  if (subtype.kind === "Pi" && type.kind === "Pi") {
    /**
       Contravariant in argument position.

       The order of type and subtype is swapped
       in the following recursive call to `include`.
    **/

    include(mod, ctx, type.argType, subtype.argType)
    const name = subtype.retTypeClosure.name
    const argType = subtype.argType
    const usedNames = [...ctxNames(ctx), ...mod.solution.names]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(argType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, argType, ctx)
    include(
      mod,
      ctx,
      applyClosure(subtype.retTypeClosure, v),
      applyClosure(type.retTypeClosure, v),
    )
    return
  }

  if (subtype.kind === "Sigma" && type.kind === "Sigma") {
    include(mod, ctx, subtype.carType, type.carType)
    const name = subtype.cdrTypeClosure.name
    const carType = subtype.carType
    const usedNames = [...ctxNames(ctx), ...mod.solution.names]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(carType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, carType, ctx)
    include(
      mod,
      ctx,
      applyClosure(subtype.cdrTypeClosure, v),
      applyClosure(type.cdrTypeClosure, v),
    )
    return
  }

  if (Values.isClazz(subtype) && Values.isClazz(type)) {
    includeClazz(mod, ctx, subtype, type)
    return
  }

  if (subtype.kind === "Equal" && type.kind === "Equal") {
    include(mod, ctx, subtype.type, type.type)
    unify(mod, ctx, type.type, subtype.from, type.from)
    unify(mod, ctx, type.type, subtype.to, type.to)
    return
  }

  unifyType(mod, ctx, subtype, type)
}
