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
      const typedNeutral = Values.TypedNeutral(type, neutral)
      if (mod.solution.needWalk(typedNeutral)) {
        return deepWalk(mod, ctx, type, mod.solution.walk(typedNeutral))
      } else {
        return typedNeutral
      }
    }

    case "Ap": {
      const target = deepWalkNeutral(
        mod,
        ctx,
        neutral.targetType,
        neutral.target,
      )
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      return Actions.doAp(target, arg.value)
    }

    case "ApImplicit": {
      const target = deepWalkNeutral(
        mod,
        ctx,
        neutral.targetType,
        neutral.target,
      )
      const arg = deepWalkTypedValue(mod, ctx, neutral.arg)
      return Actions.doApImplicit(target, arg.value)
    }

    case "Car": {
      const target = deepWalkNeutral(
        mod,
        ctx,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doCar(target)
    }

    case "Cdr": {
      const target = deepWalkNeutral(
        mod,
        ctx,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doCdr(target)
    }

    case "Dot": {
      const target = deepWalkNeutral(
        mod,
        ctx,
        neutral.targetType,
        neutral.target,
      )
      return Actions.doDot(target, neutral.name)
    }

    case "Replace": {
      const target = deepWalkNeutral(
        mod,
        ctx,
        neutral.targetType,
        neutral.target,
      )
      const motive = deepWalkTypedValue(mod, ctx, neutral.motive)
      const base = deepWalkTypedValue(mod, ctx, neutral.base)
      return Actions.doReplace(target, motive.value, base.value)
    }
  }
}
