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
  argsFreeNames: Set<string>,
  type: Value,
  args: Array<Exps.Arg>,
): {
  type: Value
  insertions: Array<Insertion>
} {
  const insertions: Array<Insertion> = []
  while (args.length > 0) {
    const [arg, ...restArgs] = args

    if (type.kind === "PiImplicit" && arg.kind === "ArgPlain") {
      // NOTE Be careful about scope bug, `freshName` might occurs in `args`.
      const name = type.retTypeClosure.name
      const usedNames = [
        ...ctxNames(ctx),
        ...mod.solution.names,
        ...argsFreeNames,
      ]
      const freshName = freshen(usedNames, name)
      const patternVar = mod.solution.createPatternVar(freshName, type.argType)
      ctx = CtxCons(freshName, type.argType, ctx)
      // NOTE Do not consume args here.
      type = applyClosure(type.retTypeClosure, patternVar)
      insertions.push(Insertions.InsertionPatternVar(patternVar))
    } else if (type.kind === "Pi" && arg.kind === "ArgPlain") {
      const argInferred = inferOrUndefined(mod, ctx, arg.exp)
      if (argInferred !== undefined) {
        if (argInferred.type.kind === "PiImplicit") {
          insertDuringCheck(mod, ctx, argInferred, [], type.argType)
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
      type = applyClosure(type.retTypeClosure, argValue)
      args = restArgs
      insertions.push(Insertions.InsertionUsedArg(argCore))
    } else if (type.kind === "PiImplicit" && arg.kind === "ArgImplicit") {
      const argCore = check(mod, ctx, arg.exp, type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      type = applyClosure(type.retTypeClosure, argValue)
      args = restArgs
      insertions.push(Insertions.InsertionImplicitArg(argCore))
    } else if (type.kind === "Pi" && arg.kind === "ArgImplicit") {
      throw new Errors.ElaborationError(
        [`[insertDuringInfer] extra Implicit argument`].join("\n"),
        { span: arg.exp.span },
      )
    } else {
      throw new Errors.ElaborationError(
        [
          `[insertDuringInfer] expect type to be Pi or PiImplicit`,
          `  given type kind: ${type.kind}`,
        ].join("\n"),
        { span: arg.exp.span },
      )
    }
  }

  return { type, insertions }
}
