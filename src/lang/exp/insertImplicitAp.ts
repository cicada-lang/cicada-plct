import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Inferred } from "../exp"
import * as Insertions from "../insertion"
import { deepWalk, Solution } from "../solution"
import { Value } from "../value"

export function insertImplicitAp(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const solved = Insertions.solveArgTypes(solution, ctx, type, args)
  for (const insertion of solved.insertions) {
    target = Insertions.applyInsertion(solved.solution, ctx, insertion, target)
  }

  const solvedType = deepWalk(solved.solution, ctx, solved.type)
  return Inferred(solvedType, target)
}
