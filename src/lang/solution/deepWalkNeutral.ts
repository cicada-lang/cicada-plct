import * as Actions from "../actions"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { deepWalk, deepWalkTypedValue } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function deepWalkNeutral(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  neutral: Neutral,
): Value {
  switch (neutral.kind) {
    case "Var": {
      const value = mod.solution.walkOrUndefined(
        Values.TypedNeutral(type, neutral),
      )

      if (value !== undefined) {
        return deepWalk(mod, ctx, type, value)
      } else {
        return mod.solution.walk(Values.TypedNeutral(type, neutral))
      }
    }

    case "Ap": {
      const targetType = neutral.targetType
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      return Actions.doAp(target, arg.value)
    }

    case "ApImplicit": {
      const targetType = neutral.targetType
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      return Actions.doApImplicit(target, arg.value)
    }

    case "Car": {
      const targetType = neutral.targetType
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      return Actions.doCar(target)
    }

    case "Cdr": {
      const targetType = neutral.targetType
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      return Actions.doCdr(target)
    }

    case "Dot": {
      const targetType = neutral.targetType
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      return Actions.doDot(target, neutral.name)
    }

    case "Replace": {
      const targetType = neutral.targetType
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const motive = deepWalkTypedValue(mod, ctx, neutral.motive)
      const base = deepWalkTypedValue(mod, ctx, neutral.base)
      return Actions.doReplace(target, motive.value, base.value)
    }
  }
}
