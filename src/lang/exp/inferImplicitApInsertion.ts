import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer, Inferred } from "../exp"
import { SolutionNull } from "../solution"

export function inferImplicitApInsertion(
  ctx: Ctx,
  exp: Exp,
): Inferred | undefined {
  /**
     Maybe `ImplicitAp` insertion.
  **/
  switch (exp.kind) {
    case "Ap": {
      const { target, args } = Exps.foldAp(exp)
      const inferred = infer(ctx, target)
      if (inferred.type.kind === "ImplicitPi" && args[0]?.kind === "ArgPlain") {
        return Exps.insertImplicitAp(
          SolutionNull(),
          ctx,
          inferred.type,
          inferred.core,
          args,
        )
      }
    }
  }
}
