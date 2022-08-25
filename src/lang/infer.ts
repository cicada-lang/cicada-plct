import * as Cores from "./Core"
import { Core } from "./Core"
import { Ctx, lookupCtxTypeOrFail } from "./Ctx"
import { Exp } from "./Exp"
import { Value } from "./Value"

export type Inferred = {
  type: Value
  core: Core
}

export function Inferred(type: Value, core: Core): Inferred {
  return {
    type,
    core,
  }
}

export function infer(ctx: Ctx, exp: Exp): Inferred {
  switch (exp.kind) {
    case "Var": {
      return Inferred(lookupCtxTypeOrFail(ctx, exp.name), Cores.Var(exp.name))
    }

    default: {
      throw new Error("TODO")
    }
  }
}
