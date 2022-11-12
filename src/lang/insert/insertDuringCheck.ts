import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { applyInsertion, solveByArgs, solveByRetType } from "../insert"
import { Mod } from "../mod"
import { Value } from "../value"

export function insertDuringCheck(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
  retType: Value,
): Core {
  const solved = solveByArgs(mod, ctx, type, args)
  const insertions = solveByRetType(mod, ctx, solved.type, retType)

  for (const insertion of solved.insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  for (const insertion of insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  return target
}
