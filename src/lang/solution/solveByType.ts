import _ from "lodash"
import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { EquationError } from "../errors"
import * as Neutrals from "../neutral"
import {
  Solution,
  solutionNames,
  solve,
  solveProperties,
  solveType,
} from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { isValue, Value } from "../value"

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
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
      const freshName = freshen(usedNames, name)
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
      assertNoExtraCommonProperties(type, left, right)
      return solveProperties(solution, ctx, type, left, right)
    }

    default: {
      return undefined
    }
  }
}

function assertNoExtraCommonProperties(
  clazz: Values.Clazz,
  left: Value,
  right: Value,
): void {
  if (isValue(left, Values.Objekt) && isValue(right, Values.Objekt)) {
    const clazzNames = Values.clazzPropertyNames(clazz)
    const leftNames = Object.keys(left.properties)
    const rightNames = Object.keys(right.properties)
    const extraCommonNames = _.intersection(
      _.difference(leftNames, clazzNames),
      _.difference(rightNames, clazzNames),
    )

    if (extraCommonNames.length > 0) {
      throw new EquationError(
        `expect no extra common names: ${extraCommonNames}`,
      )
    }
  }
}
