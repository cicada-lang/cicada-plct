import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Inferred } from "../infer"
import { applyInsertion, solveByArgs, solveByRetType } from "../insert"
import { Mod } from "../mod"
import { createSolution } from "../solution"
import { Value } from "../value"

export function insertDuringCheck(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
  retType: Value,
): Core {
  createSolution
  // let solution = createSolution()

  let solution = mod.solution

  const solvedByArgs = solveByArgs(mod, ctx, solution, inferred.type, args)
  solution = solvedByArgs.solution
  const solvedByRetType = solveByRetType(
    mod,
    ctx,
    solution,
    solvedByArgs.type,
    args,
    retType,
  )
  solution = solvedByRetType.solution

  let core = inferred.core
  for (const insertion of solvedByArgs.insertions) {
    core = applyInsertion(mod, ctx, solution, insertion, core)
  }
  for (const insertion of solvedByRetType.insertions) {
    core = applyInsertion(mod, ctx, solution, insertion, core)
  }

  return core
}
