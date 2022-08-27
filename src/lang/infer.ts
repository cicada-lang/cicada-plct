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
      return Inferred(Globals.Type, checkPi(ctx, exp.bindings, exp.retType))
    }

    default: {
      throw new Error("TODO")
    }
  }
}

function checkPi(
  ctx: Ctx,
  bindings: Array<Exps.PiBinding>,
  retType: Exp
): Core {
  if (bindings.length === 0) {
    return checkType(ctx, retType)
  }

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "PiBindingNameless": {
      const argTypeCore = checkType(ctx, binding.type)
      const retTypeCore = checkType(ctx, Exps.Pi(restBindings, retType))
      return Cores.Pi("_", argTypeCore, retTypeCore)
    }

    case "PiBindingNamed": {
      const argTypeCore = checkType(ctx, binding.type)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(binding.name, argTypeValue, ctx)
      const retTypeCore = checkType(ctx, Exps.Pi(restBindings, retType))
      return Cores.Pi(binding.name, argTypeCore, retTypeCore)
    }
  }
}
