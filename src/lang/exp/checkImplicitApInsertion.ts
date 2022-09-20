import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer } from "../exp"
import { applyInsertions, solveArgTypes, solveRetType } from "../insertion"
import { deepWalk, SolutionNull } from "../solution"
import { inclusion, Value } from "../value"

export function checkImplicitApInsertion(
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Core | undefined {
  switch (exp.kind) {
    case "Ap": {
      const { target, args } = Exps.foldAp(exp)
      const inferred = infer(ctx, target)
      if (inferred.type.kind === "ImplicitPi") {
        let solved = solveArgTypes(SolutionNull(), ctx, inferred.type, args)
        solved = solveRetType(solved.solution, solved.ctx, solved.type, type)
        inclusion(ctx, deepWalk(solved.solution, solved.ctx, solved.type), type)
        return applyInsertions(
          solved.solution,
          solved.ctx,
          solved.insertions,
          inferred.core,
        )
      }
    }
  }
}
