import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { deepWalkType, deepWalkTypedValue } from "../solution"
import * as Values from "../value"
import { readback, Value } from "../value"

export function deepWalkNeutral(mod: Mod, ctx: Ctx, type: Value, neutral: Neutral): Value {
  type = deepWalkType(mod, ctx, type)

  switch (neutral.kind) {
    case "Var": {
      return mod.solution.walk(Values.TypedNeutral(type, neutral))
    }

    case "Ap": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const targetCore = readback(mod, ctx, targetType, target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      const argCore = readback(mod, ctx, arg.type, arg.value)
      return evaluate(ctxToEnv(ctx), Cores.Ap(targetCore, argCore))
    }

    case "ApImplicit": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const targetCore = readback(mod, ctx, targetType, target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      const argCore = readback(mod, ctx, arg.type, arg.value)
      return evaluate(ctxToEnv(ctx), Cores.ApImplicit(targetCore, argCore))
    }

    case "Car": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const targetCore = readback(mod, ctx, targetType, target)
      return evaluate(ctxToEnv(ctx), Cores.Car(targetCore))
    }

    case "Cdr": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const targetCore = readback(mod, ctx, targetType, target)
      return evaluate(ctxToEnv(ctx), Cores.Cdr(targetCore))
    }

    case "Dot": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const targetCore = readback(mod, ctx, targetType, target)
      return evaluate(ctxToEnv(ctx), Cores.Dot(targetCore, neutral.name))
    }
  }
}
