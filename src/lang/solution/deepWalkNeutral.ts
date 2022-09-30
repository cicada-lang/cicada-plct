import * as Actions from "../actions"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { deepWalkType, deepWalkTypedValue } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function deepWalkNeutral(mod: Mod, ctx: Ctx, type: Value, neutral: Neutral): Value {
  type = deepWalkType(mod, ctx, type)

  switch (neutral.kind) {
    case "Var": {
      return mod.solution.walk(Values.TypedNeutral(type, neutral))
    }

    case "Ap": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      return Actions.doAp(target, arg.value)
    }

    case "ApImplicit": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      return Actions.doApImplicit(target, arg.value)
    }

    case "Car": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      return Actions.doCar(target)
    }

    case "Cdr": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      return Actions.doCdr(target)
    }

    case "Dot": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      return Actions.doDot(target, neutral.name)
    }
  }
}
