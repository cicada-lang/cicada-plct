import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { freeNames } from "../exp"
import { Inferred } from "../infer"
import { applyInsertion, solveByArgs } from "../insert"
import { Mod } from "../mod"
import { Value } from "../value"

export function insertDuringInfer(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const argsFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const solved = solveByArgs(mod, ctx, argsFreeNames, type, args)

  for (const insertion of solved.insertions) {
    target = applyInsertion(mod, ctx, insertion, target)
  }

  return Inferred(solved.type, target)
}
