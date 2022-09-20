import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer, Inferred } from "../exp"
import { applyInsertions, solveArgTypes } from "../insertion"
import { deepWalk, SolutionNull } from "../solution"

export function inferImplicitApInsertion(
  ctx: Ctx,
  exp: Exp,
): Inferred | undefined {
  switch (exp.kind) {
    case "Ap": {
      const { target, args } = Exps.foldAp(exp)
      const inferred = infer(ctx, target)
      if (inferred.type.kind === "ImplicitPi") {
        const solved = solveArgTypes(SolutionNull(), ctx, inferred.type, args)
        return Inferred(
          deepWalk(solved.solution, solved.ctx, solved.type),
          applyInsertions(
            solved.solution,
            solved.ctx,
            solved.insertions,
            inferred.core,
          ),
        )
      }
    }
  }
}
