import { applyClosure } from "../closure"
import { evaluate } from "../core"
import { Ctx, CtxCons, ctxNames, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check } from "../exp"
import * as Insertions from "../insertion"
import {
  createPatternVar,
  Solution,
  solutionNames,
  solveType,
} from "../solution"
import { freshen } from "../utils/freshen"
import { Value } from "../value"

export function solveArgTypes(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  args: Array<Exps.Arg>,
  insertions: Array<Insertions.Insertion> = [],
): {
  solution: Solution
  ctx: Ctx
  type: Value
  insertions: Array<Insertions.Insertion>
} {
  /**
     We should not `for (const arg of args) { ... }`
     because in the case of `ImplicitPi` v.s. `ArgPlain`,
     the `arg` is not consumed.
   **/

  const [arg, ...restArgs] = args

  if (arg === undefined) {
    return { solution, ctx, type, insertions }
  }

  if (type.kind === "ImplicitPi" && arg.kind === "ArgPlain") {
    const name = type.retTypeClosure.name
    // TODO Scope BUG, `freshName` might occurs in `args`.
    const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
    const freshName = freshen(usedNames, name)
    const patternVar = createPatternVar(type.argType, freshName)
    return solveArgTypes(
      solution,
      // TODO Why we need to extend `ctx` here?
      CtxCons(freshName, type.argType, ctx),
      applyClosure(type.retTypeClosure, patternVar),
      args, // NOTE Do not consume arg here.
      [...insertions, Insertions.InsertionPatternVar(patternVar)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgPlain") {
    const argInferred = Exps.inferOrUndefined(ctx, arg.exp)
    if (argInferred !== undefined) {
      solution = solveType(solution, ctx, argInferred.type, type.argType)
    }

    // TODO Do we need to call `deepWalk` here?
    const argCore = argInferred
      ? argInferred.core
      : check(ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveArgTypes(
      solution,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, Insertions.InsertionUsedArg(argCore)],
    )
  }

  if (type.kind === "ImplicitPi" && arg.kind === "ArgImplicit") {
    const argCore = Exps.check(ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveArgTypes(
      solution,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, Insertions.InsertionImplicitArg(argCore)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgImplicit") {
    throw new ElaborationError(`solveArgTypes found extra Implicit argument`)
  }

  throw new ElaborationError(
    `solveArgTypes expect type to be Pi or ImplicitPi instead of: ${type.kind}`,
  )
}
