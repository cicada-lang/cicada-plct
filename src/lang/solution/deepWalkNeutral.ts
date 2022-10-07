import * as Actions from "../actions"
import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { deepWalk, deepWalkType, deepWalkTypedValue } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function deepWalkNeutral(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  neutral: Neutral,
): Value {
  type = deepWalkType(mod, ctx, type)

  switch (neutral.kind) {
    case "Var": {
      const value = mod.solution.walkOrUndefined(Values.TypedNeutral(type, neutral))
      if (value) {
        return deepWalk(mod, ctx, type, value)
      } else {
        return mod.solution.walk(Values.TypedNeutral(type, neutral))
      }
    }

    case "Ap": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      if (Values.isValue(target, "TypedNeutral")) {
        return Actions.doAp(target, arg.value)
      } else {
        return deepWalk(mod, ctx, type, Actions.doAp(target, arg.value))
      }
    }

    case "ApImplicit": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      if (Values.isValue(target, "TypedNeutral")) {
        return Actions.doApImplicit(target, arg.value)
      } else {
        return deepWalk(mod, ctx, type, Actions.doApImplicit(target, arg.value))
      }
    }

    case "Car": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      if (Values.isValue(target, "TypedNeutral")) {
        return Actions.doCar(target)
      } else {
        return deepWalk(mod, ctx, type, Actions.doCar(target))
      }
    }

    case "Cdr": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      if (Values.isValue(target, "TypedNeutral")) {
        return Actions.doCdr(target)
      } else {
        return deepWalk(mod, ctx, type, Actions.doCdr(target))
      }
    }

    case "Dot": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      if (Values.isValue(target, "TypedNeutral")) {
        return Actions.doDot(target, neutral.name)
      } else {
        return deepWalk(mod, ctx, type, Actions.doDot(target, neutral.name))
      }
    }

    case "Replace": {
      const targetType = deepWalkType(mod, ctx, neutral.targetType)
      const target = deepWalkNeutral(mod, ctx, targetType, neutral.target)
      const motive = deepWalkTypedValue(mod, ctx, neutral.motive)
      const base = deepWalkTypedValue(mod, ctx, neutral.base)
      if (Values.isValue(target, "TypedNeutral")) {
        return Actions.doReplace(target, motive.value, base.value)
      } else {
        return deepWalk(
          mod,
          ctx,
          type,
          Actions.doReplace(target, motive.value, base.value),
        )
      }
    }
  }
}
