import { closureApply } from "../closure"
import type { Ctx } from "../ctx"
import { CtxFulfilled, ctxNames } from "../ctx"
import type * as Exps from "../exp"
import { freeNames } from "../exp"
import type { Mod } from "../mod"
import { solutionNames } from "../solution"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import type { Value } from "../value"
import * as Values from "../value"
import type { Insertion } from "./Insertion"
import * as Insertions from "./Insertion"

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
  while (type["@kind"] === "PiImplicit") {
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
      const patternVar = Values.PatternVar(type.argType, freshName)
      ctx = CtxFulfilled(freshName, type.argType, patternVar, ctx)
      type = closureApply(type.retTypeClosure, patternVar)
      insertions.push(Insertions.InsertionPatternVar(patternVar))
    }
  }

  unifyType(mod, ctx, type, retType)
  return insertions
}
