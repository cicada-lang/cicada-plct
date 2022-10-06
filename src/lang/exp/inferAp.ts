import { applyClosure } from "../closure"
import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Exps from "../exp"
import { Exp, Inferred } from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"

export function inferAp(mod: Mod, ctx: Ctx, inferred: Inferred, argExp: Exp): Inferred {
  if (Values.isValue(inferred.type, "PiImplicit")) {
    return inferApPiImplicit(mod, ctx, inferred, argExp)
  } else {
    return inferApPi(mod, ctx, inferred, argExp)
  }
}

function inferApPiImplicit(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, "PiImplicit")

  const name = inferred.type.retTypeClosure.name
  /**
     NOTE `freshName` might occur in `argExp`.
   **/
  const boundNames = new Set(ctxNames(ctx))
  const usedNames = [
    ...boundNames,
    ...mod.solution.names,
    ...Exps.freeNames(boundNames, argExp),
  ]
  const freshName = freshen(usedNames, name)
  const patternVar = mod.solution.createPatternVar(freshName, inferred.type.argType)
  ctx = CtxCons(freshName, inferred.type.argType, ctx)
  const retType = applyClosure(inferred.type.retTypeClosure, patternVar)
  const inserted = Inferred(
    retType,
    Cores.ApImplicit(inferred.core, Cores.Var(freshName)),
  )
  return inferAp(mod, ctx, inserted, argExp)
}

function inferApPi(mod: Mod, ctx: Ctx, inferred: Inferred, argExp: Exp): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, "Pi")

  let argInferred = Exps.inferOrUndefined(mod, ctx, argExp)
  if (argInferred !== undefined) {
    argInferred = Exps.insertApImplicit(mod, ctx, argInferred, inferred.type.argType)
    unifyType(mod.solution, ctx, argInferred.type, inferred.type.argType)
  }

  /**
     NOTE We can not use `argInferred.core` here,
     check against the given type is necessary.
  **/

  const argCore = Exps.check(mod, ctx, argExp, inferred.type.argType)
  const argValue = evaluate(mod.ctxToEnv(ctx), argCore)
  return Inferred(
    applyClosure(inferred.type.retTypeClosure, argValue),
    Cores.Ap(inferred.core, argCore),
  )
}
