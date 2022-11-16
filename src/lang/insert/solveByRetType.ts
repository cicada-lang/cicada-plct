import { closureApply } from "../closure"
import { Ctx, CtxFulfilled, ctxNames } from "../ctx"
import * as Exps from "../exp"
import { freeNames } from "../exp"
import { Mod } from "../mod"
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
      const metaVar = Values.MetaVar(type.argType, freshName)
      ctx = CtxFulfilled(freshName, type.argType, metaVar, ctx)
      type = closureApply(type.retTypeClosure, metaVar)
      insertions.push(Insertions.InsertionMetaVar(metaVar))
    }
  }

  unifyType(mod, ctx, type, retType)
  return insertions
}
