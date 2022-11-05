import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Inferred } from "../exp"
import { Mod } from "../mod"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { Value } from "../value"

export function insertApImplicit(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  type: Value,
): Inferred {
  if (!Values.isValue(inferred.type, "PiImplicit")) {
    return inferred
  }

  const name = inferred.type.retTypeClosure.name
  const boundNames = new Set(ctxNames(ctx))
  const usedNames = [...boundNames, ...mod.solution.names]
  const freshName = freshen(usedNames, name)
  const patternVar = mod.solution.createPatternVar(
    freshName,
    inferred.type.argType,
  )
  ctx = CtxCons(freshName, inferred.type.argType, ctx)
  const retType = applyClosure(inferred.type.retTypeClosure, patternVar)

  const insertedInferred = Inferred(
    retType,
    Cores.ApImplicit(inferred.core, Cores.Var(freshName)),
  )

  return insertApImplicit(mod, ctx, insertedInferred, type)
}
