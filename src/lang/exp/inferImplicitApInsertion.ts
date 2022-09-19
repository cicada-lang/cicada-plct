import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer, Inferred } from "../exp"
import { SolutionNull } from "../solution"

export function inferImplicitApInsertion(
  ctx: Ctx,
  exp: Exp,
): Inferred | undefined {
  switch (exp.kind) {
    case "Ap": {
      const { target, args } = Exps.foldAp(exp)
      const inferred = infer(ctx, target)
      if (inferred.type.kind === "ImplicitPi") {
        const solution = SolutionNull()
        return Exps.insertImplicitAp(
          solution,
          ctx,
          inferred.type,
          inferred.core,
          args,
        )
      }
    }
  }
}
