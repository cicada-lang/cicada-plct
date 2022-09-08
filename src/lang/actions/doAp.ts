import { applyClosure } from "../closure"
import { EvaluationError } from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import {
  assertClazz,
  assertValue,
  isClazz,
  isValue,
  TypedValue,
  Value,
} from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (isValue(target, Values.Fn)) {
    return applyClosure(target.retClosure, arg)
  }

  if (isClazz(target)) {
    return applyClazz(target, arg)
  }

  assertValue(target, Values.TypedNeutral)
  assertValue(target.type, Values.Pi)

  return Values.TypedNeutral(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.Ap(target.neutral, TypedValue(target.type.argType, arg)),
  )
}

function applyClazz(clazz: Values.Clazz, arg: Value): Values.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new EvaluationError("cannot apply argument to ClazzNull")
    }

    case "ClazzCons": {
      const rest = applyClosure(clazz.restClosure, arg)
      assertClazz(rest)

      // TODO: we should check the type of arg to clazz.propertyType here
      return Values.ClazzFulfilled(clazz.name, clazz.propertyType, arg, rest)
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        clazz.name,
        clazz.propertyType,
        clazz.property,
        applyClazz(clazz.rest, arg),
      )
    }
  }
}
