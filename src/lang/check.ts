import { Core } from "./Core"
import { Ctx } from "./Ctx"
import { Exp } from "./Exp"
import { inclusion } from "./inclusion"
import { infer } from "./infer"
import { Value } from "./Value"

export function check(ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var":
    case "Ap":
    case "Car":
    case "Cdr": {
      const inferred = infer(ctx, exp)
      inclusion(ctx, inferred.type, type)
      return inferred.core
    }

    default:
      throw new Error("TODO")
  }
}

export function checkType(ctx: Ctx, type: Exp): Core {
  throw new Error("TODO")
}
