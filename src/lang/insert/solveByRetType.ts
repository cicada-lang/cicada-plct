import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Exps from "../exp"
import { freeNames } from "../exp"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { MetaVar, solutionMetaVar, solutionNames } from "../solution"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import { Value } from "../value"
import * as Insertions from "./Insertion"
import { Insertion } from "./Insertion"

export function solveByRetType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  args: Array<Exps.Arg>,
  retType: Value,
): Array<Insertion> {
  const argsFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const insertions: Array<Insertion> = []
  while (type.kind === "PiImplicit") {
    try {
      unifyType(mod, ctx, type, retType)
      return insertions
    } catch (_error) {
      // NOTE Be careful about scope bug, `freshName` might occurs in `args`.
      const name = type.retTypeClosure.name
      const usedNames = [
        ...ctxNames(ctx),
        ...solutionNames(mod.solution),
        ...argsFreeNames,
      ]
      const freshName = freshen(usedNames, name)
      const patternVar = MetaVar(type.argType, Neutrals.Var(freshName))
      solutionMetaVar(mod.solution, patternVar)
      ctx = CtxCons(freshName, type.argType, ctx)
      type = applyClosure(type.retTypeClosure, patternVar)
      insertions.push(Insertions.InsertionMetaVar(patternVar))
    }
  }

  unifyType(mod, ctx, type, retType)
  return insertions
}
