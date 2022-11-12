import { check } from "../check"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames, ctxToEnv } from "../ctx"
import * as Errors from "../errors"
import { evaluate } from "../evaluate"
import * as Exps from "../exp"
import { inferOrUndefined } from "../infer"
import { insertDuringCheck, Insertion } from "../insert"
import { Mod } from "../mod"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import { Value } from "../value"
import * as Insertions from "./Insertion"

export function solveByArgs(
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
    return solveByArgs(
      mod,
      // TODO Why we need to extend `ctx` here?
      CtxCons(freshName, type.argType, ctx),
      applyClosure(type.retTypeClosure, patternVar),
      args, // NOTE Do not consume arg here.
      [...insertions, Insertions.InsertionPatternVar(patternVar)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgPlain") {
    const argInferred = inferOrUndefined(mod, ctx, arg.exp)
    if (argInferred !== undefined) {
      if (argInferred.type.kind === "PiImplicit") {
        insertDuringCheck(
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
    return solveByArgs(
      mod,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, Insertions.InsertionUsedArg(argCore)],
    )
  }

  if (type.kind === "PiImplicit" && arg.kind === "ArgImplicit") {
    const argCore = check(mod, ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveByArgs(
      mod,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, Insertions.InsertionImplicitArg(argCore)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgImplicit") {
    throw new Errors.ElaborationError(
      [`[insertDuringInfer] extra Implicit argument`].join("\n"),
      { span: undefined },
    )
  }

  throw new Errors.ElaborationError(
    [
      `[insertDuringInfer] expect type to be Pi or PiImplicit`,
      `  given type kind: ${type.kind}`,
    ].join("\n"),
    { span: undefined },
  )
}
