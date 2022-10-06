import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Exps from "../exp"
import { Inferred } from "../exp"
import { Mod } from "../mod"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { Value } from "../value"

export function checkVar(mod: Mod, ctx: Ctx, inferred: Inferred, type: Value): Core {
  if (Values.isValue(inferred.type, "PiImplicit")) {
    return checkVarPiImplicit(mod, ctx, inferred, type)
  } else {
    return Exps.checkInferred(mod, ctx, inferred, type)
  }
}

function checkVarPiImplicit(mod: Mod, ctx: Ctx, inferred: Inferred, type: Value): Core {
  Values.assertTypeInCtx(ctx, inferred.type, "PiImplicit")

  const name = inferred.type.retTypeClosure.name
  const boundNames = new Set(ctxNames(ctx))
  const usedNames = [...boundNames, ...mod.solution.names]
  const freshName = freshen(usedNames, name)
  const patternVar = mod.solution.createPatternVar(freshName, inferred.type.argType)
  ctx = CtxCons(freshName, inferred.type.argType, ctx)
  const retType = applyClosure(inferred.type.retTypeClosure, patternVar)

  /**
     `ApImplicit` insertion.
  **/
  inferred = Inferred(retType, Cores.ApImplicit(inferred.core, Cores.Var(freshName)))

  return checkVar(mod, ctx, inferred, type)
}
