import type { Ctx } from "../ctx/index.js"
import type * as Exps from "../exp/index.js"
import { Inferred } from "../infer/index.js"
import { insertionApply, solveByArgs } from "../insert/index.js"
import type { Mod } from "../mod/index.js"

export function insertDuringInfer(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
): Inferred {
  const solved = solveByArgs(mod, ctx, inferred.type, args)

  let core = inferred.core

  for (const insertion of solved.insertions) {
    core = insertionApply(mod, ctx, insertion, core)
  }

  return Inferred(solved.type, core)
}
