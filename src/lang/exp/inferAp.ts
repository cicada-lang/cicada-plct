import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { Exp, Inferred } from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { Value } from "../value"

export function inferAp(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  core: Core,
  argExp: Exp,
): Inferred {
  if (Values.isValue(type, "PiImplicit")) {
    return inferApPiImplicit(mod, ctx, type, core, argExp)
  } else {
    return inferApPi(mod, ctx, type, core, argExp)
  }
}

function inferApPiImplicit(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  core: Core,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(mod, ctx, type, "PiImplicit")

  const name = type.retTypeClosure.name
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
  const patternVar = mod.solution.createPatternVar(freshName, type.argType)
  const retType = applyClosure(type.retTypeClosure, patternVar)
  ctx = CtxCons(freshName, type.argType, ctx)
  return inferAp(
    mod,
    ctx,
    retType,
    Cores.ApImplicit(core, Cores.Var(freshName)),
    argExp,
  )
}

function inferApPi(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  core: Core,
  argExp: Exp,
): Inferred {
  Values.assertTypeInCtx(mod, ctx, type, "Pi")

  const argInferred = Exps.inferOrUndefined(mod, ctx, argExp)
  if (argInferred !== undefined) {
    const argInserted = Exps.insertApImplicit(mod, ctx, argInferred)
    try {
      unifyType(mod, ctx, argInserted.type, type.argType)
    } catch (error) {
      if (error instanceof Errors.UnificationError) {
        throw new Errors.ElaborationError(
          ["inferApPi fail", ...error.trace, error.message].join("\n"),
          { span: argExp.span },
        )
      }

      throw error
    }
  }

  /**
     NOTE We can not use `argInserted.core` here,
     check against the given type is necessary.
  **/

  const argCore = Exps.check(mod, ctx, argExp, type.argType)
  const argValue = evaluate(mod.ctxToEnv(ctx), argCore)
  return Inferred(
    applyClosure(type.retTypeClosure, argValue),
    Cores.Ap(core, argCore),
  )
}
