import { closureApply } from "../closure/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxFulfilled, ctxNames } from "../ctx/index.js"
import type * as Exps from "../exp/index.js"
import { freeNames } from "../exp/index.js"
import type { Mod } from "../mod/index.js"
import { solutionNames } from "../solution/index.js"
import { unifyType } from "../unify/index.js"
import { freshen } from "../utils/freshen.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"
import type { Insertion } from "./Insertion.js"
import * as Insertions from "./Insertion.js"

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
