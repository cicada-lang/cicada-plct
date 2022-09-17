import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, ctxToEnv, lookupTypeInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check, Inferred } from "../exp"
import {
  lookupValueInSolution,
  PatternVar,
  Solution,
  solve,
  walk,
} from "../solution"
import * as Values from "../value"
import { readback, Value } from "../value"

export function insertImplicitAp(
  patternVars: Array<PatternVar>,
  solution: Solution,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const [arg, ...restArgs] = args

  if (arg?.kind !== "ArgPlain") {
    type = walk(solution, type)
    let inferred = Inferred(type, target)
    inferred = insertByPatternVars(patternVars, solution, ctx, inferred)
    inferred = collectInferredByArgs(ctx, inferred, args)
    return inferred
  }

  const argInferred = Exps.inferOrUndefined(ctx, arg.exp)

  /**
       TODO We also need to handle `Values.ImplicitPi`.
    **/
  Values.assertTypeInCtx(ctx, type, Values.Pi)

  if (argInferred !== undefined) {
    solution = solve(
      solution,
      ctx,
      Values.Type(),
      argInferred.type,
      type.argType,
    )
    const argCore = argInferred.core
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    const retType = applyClosure(type.retTypeClosure, argValue)
    return insertImplicitAp(
      patternVars,
      solution,
      ctx,
      retType,
      target,
      restArgs,
    )
  } else {
    const argCore = check(ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    const retType = applyClosure(type.retTypeClosure, argValue)
    return insertImplicitAp(
      patternVars,
      solution,
      ctx,
      retType,
      target,
      restArgs,
    )
  }
}

function insertByPatternVars(
  patternVars: Array<PatternVar>,
  solution: Solution,
  ctx: Ctx,
  inferred: Inferred,
): Inferred {
  for (const patternVar of patternVars) {
    inferred = insertByPatternVar(patternVar, solution, ctx, inferred)
  }

  return inferred
}

function insertByPatternVar(
  patternVar: PatternVar,
  solution: Solution,
  ctx: Ctx,
  inferred: Inferred,
): Inferred {
  let argValue = lookupValueInSolution(solution, patternVar.neutral.name)
  if (argValue === undefined) {
    throw new ElaborationError(
      `Unsolved patternVar: ${patternVar.neutral.name}`,
    )
  }

  // TODO where to call `walk` or `deepWalk`?
  // argValue = walk(solution, argValue)

  let argType = lookupTypeInCtx(ctx, patternVar.neutral.name)
  if (argType === undefined) {
    throw new ElaborationError(
      `Undefined arg type name: ${patternVar.neutral.name}`,
    )
  }

  // TODO where to call `walk` or `deepWalk`?
  // argType = walk(solution, argType)

  const argCore = readback(ctx, argType, argValue)

  return Inferred(inferred.type, Cores.ImplicitAp(inferred.core, argCore))
}

function collectInferredByArgs(
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
): Inferred {
  for (const arg of args) {
    inferred = collectInferredByArg(ctx, inferred, arg)
  }

  return inferred
}

function collectInferredByArg(
  ctx: Ctx,
  inferred: Inferred,
  arg: Exps.Arg,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, Values.Pi)
  const argCore = Exps.check(ctx, arg.exp, inferred.type.argType)
  const argValue = evaluate(ctxToEnv(ctx), argCore)

  switch (arg.kind) {
    case "ArgPlain": {
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.Ap(inferred.core, argCore),
      )
    }

    case "ArgImplicit": {
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.ImplicitAp(inferred.core, argCore),
      )
    }
  }
}
