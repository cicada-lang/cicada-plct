import { checkType } from "./check"
import * as Cores from "./Core"
import { Core } from "./Core"
import { Ctx, CtxCons, ctxToEnv, lookupCtxType } from "./Ctx"
import { ElaborationError } from "./errors/ElaborationError"
import { evaluate } from "./evaluate"
import * as Exps from "./Exp"
import { Exp } from "./Exp"
import * as Globals from "./globals"
import { globals } from "./globals"
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
      if (foundType !== undefined) {
        return Inferred(foundType, Cores.Var(exp.name))
      }

      const globalValue = globals.lookupValue(exp.name)
      if (globalValue !== undefined) {
        return Inferred(globalValue.type, Cores.Global(exp.name))
      }

      throw new ElaborationError(`Undefined name ${exp.name}`)
    }

    case "Pi": {
      if (exp.bindings.length === 0) {
        return Inferred(Globals.Type, checkType(ctx, exp.retType))
      } else {
        const [binding, ...restBindings] = exp.bindings
        switch (binding.kind) {
          case "PiBindingNameless": {
            const argTypeCore = checkType(ctx, binding.type)
            const inferredRetType = infer(
              ctx,
              Exps.Pi(restBindings, exp.retType)
            )

            return Inferred(
              Globals.Type,
              Cores.Pi("_", argTypeCore, inferredRetType.core)
            )
          }

          case "PiBindingNamed": {
            const argTypeCore = checkType(ctx, binding.type)
            const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
            const inferredRetType = infer(
              CtxCons(binding.name, argTypeValue, ctx),
              Exps.Pi(restBindings, exp.retType)
            )

            return Inferred(
              Globals.Type,
              Cores.Pi(binding.name, argTypeCore, inferredRetType.core)
            )
          }
        }
      }
    }

    default: {
      throw new Error("TODO")
    }
  }
}
