import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { freeNames } from "../exp"
import { Inferred } from "../infer"
import { applyInsertion, solveByArgs, solveByRetType } from "../insert"
import { Mod } from "../mod"
import { Value } from "../value"

export function insertDuringCheck(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
  retType: Value,
): Core {
  const argsFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const solved = solveByArgs(mod, ctx, argsFreeNames, inferred.type, args)
  const insertions = solveByRetType(
    mod,
    ctx,
    argsFreeNames,
    solved.type,
    retType,
  )

  let core: Core = inferred.core

  for (const insertion of solved.insertions) {
    core = applyInsertion(mod, ctx, insertion, core)
  }

  for (const insertion of insertions) {
    core = applyInsertion(mod, ctx, insertion, core)
  }

  return core
}
