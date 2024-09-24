import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type * as Exps from "../exp/index.js"
import type { Inferred } from "../infer/index.js"
import { insertionApply, solveByArgs, solveByRetType } from "../insert/index.js"
import type { Mod } from "../mod/index.js"
import type { Value } from "../value/index.js"

export function insertDuringCheck(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
  retType: Value,
): Core {
  const solved = solveByArgs(mod, ctx, inferred.type, args)
  const insertions = solveByRetType(mod, ctx, solved.type, args, retType)

  let core: Core = inferred.core

  for (const insertion of solved.insertions) {
    core = insertionApply(mod, ctx, insertion, core)
  }

  for (const insertion of insertions) {
    core = insertionApply(mod, ctx, insertion, core)
  }

  return core
}
