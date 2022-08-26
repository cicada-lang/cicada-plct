import * as Cores from "./Core"
import { Core } from "./Core"
import { Ctx, lookupCtxType } from "./Ctx"
import { ElaborationError } from "./errors/ElaborationError"
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
      const foundType = lookupCtxType(ctx, exp.name)
      if (foundType === undefined) {
        throw new ElaborationError(`Undefined name ${exp.name}`)
      }

      return Inferred(foundType, Cores.Var(exp.name))
    }

    default: {
      throw new Error("TODO")
    }
  }
}
