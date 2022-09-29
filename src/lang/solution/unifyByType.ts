import _ from "lodash"
import * as Actions from "../actions"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { EquationError } from "../errors"
import * as Neutrals from "../neutral"
import { Solution, unify, unifyProperties, unifyType } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { Value } from "../value"

export function unifyByType(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  switch (type.kind) {
    case "Type": {
      unifyType(solution, ctx, left, right)
      return "ok"
    }

    case "Trivial": {
      return "ok"
    }

    case "Pi": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const leftRet = Actions.doAp(left, typedNeutral)
      const rightRet = Actions.doAp(right, typedNeutral)
      unify(solution, ctx, retType, leftRet, rightRet)
      return "ok"
    }

    case "PiImplicit": {
      const name = type.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...solution.names]
      const freshName = freshen(usedNames, name)
      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(type.argType, variable)
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      ctx = CtxCons(freshName, type.argType, ctx)
      const leftRet = Actions.doApImplicit(left, typedNeutral)
      const rightRet = Actions.doApImplicit(right, typedNeutral)
      unify(solution, ctx, retType, leftRet, rightRet)
      return "ok"
    }

    case "Sigma": {
      const leftCar = Actions.doCar(left)
      const rightCar = Actions.doCar(right)
      unify(solution, ctx, type.carType, leftCar, rightCar)
      const car = Actions.doCar(left)
      const cdrType = applyClosure(type.cdrTypeClosure, car)
      const leftCdr = Actions.doCdr(left)
      const rightCdr = Actions.doCdr(right)
      unify(solution, ctx, cdrType, leftCdr, rightCdr)
      return "ok"
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      assertNoExtraCommonProperties(type, left, right)
      unifyProperties(solution, ctx, type, left, right)
      return "ok"
    }
  }
}

function assertNoExtraCommonProperties(clazz: Values.Clazz, left: Value, right: Value): void {
  if (Values.isValue(left, Values.Objekt) && Values.isValue(right, Values.Objekt)) {
    const clazzNames = Values.clazzPropertyNames(clazz)
    const leftNames = Object.keys(left.properties)
    const rightNames = Object.keys(right.properties)
    const extraCommonNames = _.intersection(
      _.difference(leftNames, clazzNames),
      _.difference(rightNames, clazzNames),
    )

    if (extraCommonNames.length > 0) {
      throw new EquationError(`expect no extra common names: ${extraCommonNames}`)
    }
  }
}
