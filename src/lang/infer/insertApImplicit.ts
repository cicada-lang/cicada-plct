import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Inferred } from "../infer"
import { Mod } from "../mod"
import { freshen } from "../utils/freshen"
import * as Values from "../value"

export function insertApImplicit(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
): Inferred {
  while (inferred.type.kind === "PiImplicit") {
    inferred = insertApImplicitStep(mod, ctx, inferred.type, inferred.core)
  }

  return inferred
}

export function insertApImplicitStep(
  mod: Mod,
  ctx: Ctx,
  type: Values.PiImplicit,
  core: Core,
): Inferred {
  const name = type.retTypeClosure.name
  const boundNames = new Set(ctxNames(ctx))
  const usedNames = [...boundNames, ...mod.solution.names]
  const freshName = freshen(usedNames, name)
  const patternVar = mod.solution.createPatternVar(freshName, type.argType)
  ctx = CtxCons(freshName, type.argType, ctx)
  const retType = applyClosure(type.retTypeClosure, patternVar)
  return Inferred(retType, Cores.ApImplicit(core, Cores.Var(freshName)))
}
