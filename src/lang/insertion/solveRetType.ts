import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Insertions from "../insertion"
import {
  createPatternVar,
  Solution,
  solutionNames,
  solveType,
} from "../solution"
import { freshen } from "../utils/freshen"
import { Value } from "../value"

export function solveRetType(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  retType: Value,
  insertions: Array<Insertions.Insertion> = [],
): {
  solution: Solution
  ctx: Ctx
  type: Value
  insertions: Array<Insertions.Insertion>
} {
  if (type.kind === "ImplicitPi") {
    const name = type.retTypeClosure.name
    // TODO Scope BUG, `freshName` might occurs in `args`.
    const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
    const freshName = freshen(usedNames, name)
    const patternVar = createPatternVar(type.argType, freshName)
    return solveRetType(
      solution,
      // TODO Why we need to extend `ctx` here?
      CtxCons(freshName, type.argType, ctx),
      applyClosure(type.retTypeClosure, patternVar),
      retType,
      [...insertions, Insertions.InsertionPatternVar(patternVar)],
    )
  }

  solution = solveType(solution, ctx, type, retType)

  return { solution, ctx, type, insertions }
}
