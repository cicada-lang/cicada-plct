import { deepWalkType, deepWalkTypedValue } from "."
import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import { Mod } from "../mod"
import * as Values from "../value"
import { readback, TypedNeutral, Value } from "../value"

export function deepWalkNeutral(mod: Mod, ctx: Ctx, typeNeutral: TypedNeutral): Value {
  let type = deepWalkType(mod, ctx, typeNeutral.type)

  switch (typeNeutral.neutral.kind) {
    case "Var": {
      return mod.solution.walk(Values.TypedNeutral(type, typeNeutral.neutral))
    }

    case "Ap": {
      let targetType = deepWalkType(mod, ctx, typeNeutral.neutral.targetType)
      let targetValue = deepWalkNeutral(
        mod,
        ctx,
        Values.TypedNeutral(targetType, typeNeutral.neutral.target),
      )
      let targetCore = readback(mod, ctx, targetType, targetValue)

      let argValue = deepWalkTypedValue(mod, ctx, typeNeutral.neutral.arg)
      let argCore = readback(mod, ctx, argValue.type, argValue.value)
      let target = evaluate(ctxToEnv(ctx), Cores.Ap(targetCore, argCore))
      return target
    }

    case "ApImplicit": {
      let targetType = deepWalkType(mod, ctx, typeNeutral.neutral.targetType)
      let targetValue = deepWalkNeutral(
        mod,
        ctx,
        Values.TypedNeutral(targetType, typeNeutral.neutral.target),
      )
      let targetCore = readback(mod, ctx, targetType, targetValue)

      let argValue = deepWalkTypedValue(mod, ctx, typeNeutral.neutral.arg)
      let argCore = readback(mod, ctx, argValue.type, argValue.value)
      let target = evaluate(ctxToEnv(ctx), Cores.ApImplicit(targetCore, argCore))
      return target
    }

    case "Car": {
      let targetType = deepWalkType(mod, ctx, typeNeutral.neutral.targetType)
      let targetValue = deepWalkNeutral(
        mod,
        ctx,
        Values.TypedNeutral(targetType, typeNeutral.neutral.target),
      )
      let targetCore = readback(mod, ctx, targetType, targetValue)
      let target = evaluate(ctxToEnv(ctx), Cores.Car(targetCore))
      return target
    }

    case "Cdr": {
      let targetType = deepWalkType(mod, ctx, typeNeutral.neutral.targetType)
      let targetValue = deepWalkNeutral(
        mod,
        ctx,
        Values.TypedNeutral(targetType, typeNeutral.neutral.target),
      )
      let targetCore = readback(mod, ctx, targetType, targetValue)
      let target = evaluate(ctxToEnv(ctx), Cores.Cdr(targetCore))
      return target
    }

    case "Dot": {
      let targetType = deepWalkType(mod, ctx, typeNeutral.neutral.targetType)
      let targetValue = deepWalkNeutral(
        mod,
        ctx,
        Values.TypedNeutral(targetType, typeNeutral.neutral.target),
      )
      let targetCore = readback(mod, ctx, targetType, targetValue)
      let target = evaluate(ctxToEnv(ctx), Cores.Dot(targetCore, typeNeutral.neutral.name))
      return target
    }
  }
}
