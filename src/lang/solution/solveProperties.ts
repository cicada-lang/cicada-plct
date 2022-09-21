import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx } from "../ctx"
import { Solution, solve } from "../solution"
import * as Values from "../value"
import { assertClazzInCtx, Value } from "../value"

export function solveProperties(
  solution: Solution,
  ctx: Ctx,
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): Solution {
  switch (clazz.kind) {
    case "ClazzNull": {
      return solution
    }

    case "ClazzCons": {
      const leftPropertyValue = Actions.doDot(left, clazz.name)
      const rightPropertyValue = Actions.doDot(right, clazz.name)
      solve(
        solution,
        ctx,
        clazz.propertyType,
        leftPropertyValue,
        rightPropertyValue,
      )
      const rest = applyClosure(clazz.restClosure, leftPropertyValue)
      assertClazzInCtx(ctx, rest)
      return solveProperties(solution, ctx, rest, left, right)
    }

    case "ClazzFulfilled": {
      const leftPropertyValue = Actions.doDot(left, clazz.name)
      const rightPropertyValue = Actions.doDot(right, clazz.name)
      solve(
        solution,
        ctx,
        clazz.propertyType,
        leftPropertyValue,
        rightPropertyValue,
      )
      return solveProperties(solution, ctx, clazz.rest, left, right)
    }
  }
}
