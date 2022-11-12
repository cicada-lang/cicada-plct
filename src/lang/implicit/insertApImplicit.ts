import { indent } from "../../utils/indent"
import { check } from "../check"
import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, ctxNames, ctxToEnv } from "../ctx"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import * as Exps from "../exp"
import { inferOrUndefined, Inferred } from "../infer"
import { Mod } from "../mod"
import { readback } from "../readback"
import { PatternVar } from "../solution"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import { formatType, Value } from "../value"

export function checkWithApImplicitInsertion(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
  retType: Value,
): Core {
  const solved = solveArgs(mod, ctx, type, args)
  const insertions = tryToSolveByRetType(mod, ctx, solved.type, retType)

  for (const insertion of solved.insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  for (const insertion of insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  return target
}

function tryToSolveByRetType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  retType: Value,
): Array<Insertion> {
  const insertions: Array<Insertion> = []
  while (type.kind === "PiImplicit") {
    try {
      unifyType(mod, ctx, type, retType)
      return insertions
    } catch (_error) {
      const name = type.retTypeClosure.name
      // TODO Scope BUG, `freshName` might occurs in `args`.
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const patternVar = mod.solution.createPatternVar(freshName, type.argType)
      ctx = CtxCons(freshName, type.argType, ctx)
      type = applyClosure(type.retTypeClosure, patternVar)
      insertions.push(InsertionPatternVar(patternVar))
    }
  }

  try {
    unifyType(mod, ctx, type, retType)
    return insertions
  } catch (error) {
    if (
      error instanceof Errors.UnificationError ||
      error instanceof Errors.InclusionError
    ) {
      throw new Errors.ElaborationError(
        [
          `[tryToSolveByRetType] fail`,
          // indent(`var name: ${exp.name}`),
          indent(`inferred target type: ${formatType(mod, ctx, type)}`),
          indent(`return type: ${formatType(mod, ctx, retType)}`),
          ...error.trace,
          error.message,
        ].join("\n"),
        { span: undefined },
      )
    }

    throw error
  }
}

export function insertApImplicit(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const solved = solveArgs(mod, ctx, type, args)
  for (const insertion of solved.insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  return Inferred(solved.type, target)
}

function solveArgs(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  args: Array<Exps.Arg>,
  insertions: Array<Insertion> = [],
): {
  type: Value
  insertions: Array<Insertion>
} {
  const [arg, ...restArgs] = args

  if (arg === undefined) {
    return { type, insertions }
  }

  if (type.kind === "PiImplicit" && arg.kind === "ArgPlain") {
    const name = type.retTypeClosure.name
    // TODO Scope BUG, `freshName` might occurs in `args`.
    const usedNames = [...ctxNames(ctx), ...mod.solution.names]
    const freshName = freshen(usedNames, name)
    const patternVar = mod.solution.createPatternVar(freshName, type.argType)
    return solveArgs(
      mod,
      // TODO Why we need to extend `ctx` here?
      CtxCons(freshName, type.argType, ctx),
      applyClosure(type.retTypeClosure, patternVar),
      args, // NOTE Do not consume arg here.
      [...insertions, InsertionPatternVar(patternVar)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgPlain") {
    const argInferred = inferOrUndefined(mod, ctx, arg.exp)
    if (argInferred !== undefined) {
      if (argInferred.type.kind === "PiImplicit") {
        checkWithApImplicitInsertion(
          mod,
          ctx,
          argInferred.type,
          argInferred.core,
          [],
          type.argType,
        )
      } else {
        unifyType(mod, ctx, argInferred.type, type.argType)
      }
    }

    /**
       NOTE We can not use `argInserted.core` here,
       check against the given type is necessary.
    **/

    const argCore = check(mod, ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveArgs(
      mod,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, InsertionUsedArg(argCore)],
    )
  }

  if (type.kind === "PiImplicit" && arg.kind === "ArgImplicit") {
    const argCore = check(mod, ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveArgs(
      mod,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, InsertionImplicitArg(argCore)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgImplicit") {
    throw new Errors.ElaborationError(
      [`[insertApImplicit] extra Implicit argument`].join("\n"),
      { span: undefined },
    )
  }

  throw new Errors.ElaborationError(
    [
      `[insertApImplicit] expect type to be Pi or PiImplicit`,
      `  given type kind: ${type.kind}`,
    ].join("\n"),
    { span: undefined },
  )
}

type Insertion = InsertionPatternVar | InsertionUsedArg | InsertionImplicitArg

type InsertionPatternVar = {
  kind: "InsertionPatternVar"
  patternVar: PatternVar
}

function InsertionPatternVar(patternVar: PatternVar): InsertionPatternVar {
  return {
    kind: "InsertionPatternVar",
    patternVar,
  }
}

type InsertionUsedArg = {
  kind: "InsertionUsedArg"
  argCore: Core
}

function InsertionUsedArg(argCore: Core): InsertionUsedArg {
  return {
    kind: "InsertionUsedArg",
    argCore,
  }
}

type InsertionImplicitArg = {
  kind: "InsertionImplicitArg"
  argCore: Core
}

function InsertionImplicitArg(argCore: Core): InsertionImplicitArg {
  return {
    kind: "InsertionImplicitArg",
    argCore,
  }
}

function applyInsertion(
  mod: Mod,
  ctx: Ctx,
  insertion: Insertion,
  core: Core,
): Core {
  switch (insertion.kind) {
    case "InsertionPatternVar": {
      const argValue = mod.solution.lookupValue(
        insertion.patternVar.neutral.name,
      )
      if (argValue === undefined) {
        throw new Errors.ElaborationError(
          [
            `[insertApImplicit applyInsertion] unsolved pattern variable`,
            `  variable name: ${insertion.patternVar.neutral.name}`,
          ].join("\n"),
          // TODO Span
          { span: undefined },
        )
      }

      const argCore = readback(mod, ctx, insertion.patternVar.type, argValue)
      return Cores.ApImplicit(core, argCore)
    }

    case "InsertionUsedArg": {
      return Cores.Ap(core, insertion.argCore)
    }

    case "InsertionImplicitArg": {
      return Cores.ApImplicit(core, insertion.argCore)
    }
  }
}
