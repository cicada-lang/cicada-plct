import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Inferred } from "../infer"
import { insertionApply, solveByArgs, solveByRetType } from "../insert"
import { Mod } from "../mod"
import { Value } from "../value"

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
