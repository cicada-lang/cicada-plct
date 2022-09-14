import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import * as Neutrals from "../neutral"
import { Solution, solve, solveType } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function solveByType(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution | undefined {
  switch (type.kind) {
    case "Type": {
      return solveType(solution, ctx, left, right)
    }

    case "Trivial": {
      return solution
    }

    case "Pi": {
      const freshName = freshenInCtx(ctx, type.retTypeClosure.name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const retTypeValue = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const leftRetValue = Actions.doAp(left, typedNeutral)
      const rightRetValue = Actions.doAp(right, typedNeutral)
      return solve(solution, ctx, retTypeValue, leftRetValue, rightRetValue)
    }

    default: {
      return undefined
    }
  }
}
