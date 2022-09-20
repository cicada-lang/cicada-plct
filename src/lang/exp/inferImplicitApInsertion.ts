import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer, Inferred } from "../exp"
import * as Insertions from "../insertion"
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
        const { solution, insertions, type } = Insertions.solveArgTypes(
          SolutionNull(),
          ctx,
          inferred.type,
          args,
        )
        return Inferred(
          deepWalk(solution, ctx, type),
          Insertions.applyInsertions(solution, ctx, insertions, inferred.core),
        )
      }
    }
  }
}
