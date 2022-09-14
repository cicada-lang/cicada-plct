import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import * as Neutrals from "../neutral"
import { Solution, solve, solveProperties, solveType } from "../solution"
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
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const leftRet = Actions.doAp(left, typedNeutral)
      const rightRet = Actions.doAp(right, typedNeutral)
      return solve(solution, ctx, retType, leftRet, rightRet)
    }

    case "Sigma": {
      const leftCar = Actions.doCar(left)
      const rightCar = Actions.doCar(right)
      solution = solve(solution, ctx, type.carType, leftCar, rightCar)
      const car = Actions.doCar(left)
      const cdrType = applyClosure(type.cdrTypeClosure, car)
      const leftCdr = Actions.doCdr(left)
      const rightCdr = Actions.doCdr(right)
      solution = solve(solution, ctx, cdrType, leftCdr, rightCdr)
      return solution
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return solveProperties(solution, ctx, type, left, right)
    }

    default: {
      return undefined
    }
  }
}
