import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { freeNames } from "../exp"
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
  const argsFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const solved = solveByArgs(mod, ctx, argsFreeNames, type, args)
  const insertions = solveByRetType(
    mod,
    ctx,
    argsFreeNames,
    solved.type,
    retType,
  )

  for (const insertion of solved.insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  for (const insertion of insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  return target
}
