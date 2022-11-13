import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Inferred } from "../infer"
import { applyInsertion, solveByArgs } from "../insert"
import { Mod } from "../mod"

export function insertDuringInfer(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
): Inferred {
  // let solution = createSolution()
  let solution = mod.solution
  const solvedByArgs = solveByArgs(mod, ctx, solution, inferred.type, args)
  solution = solvedByArgs.solution

  let core = inferred.core

  for (const insertion of solvedByArgs.insertions) {
    core = applyInsertion(mod, ctx, solution, insertion, core)
  }

  return Inferred(solvedByArgs.type, core)
}
