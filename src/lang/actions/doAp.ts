import { applyClosure } from "../closure"
import { EvaluationError } from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (Values.isValue(target, Values.Fn)) {
    return applyClosure(target.retClosure, arg)
  }

  if (Values.isValue(target, Values.ImplicitFn)) {
    return applyClosure(target.retClosure, arg)
  }

  if (Values.isClazz(target)) {
    return Values.fulfillClazz(target, arg)
  }

  Values.assertValue(target, Values.TypedNeutral)

  if (Values.isValue(target.type, Values.Pi)) {
    return Values.TypedNeutral(
      applyClosure(target.type.retTypeClosure, arg),
      Neutrals.Ap(target.neutral, TypedValue(target.type.argType, arg)),
    )
  }

  if (Values.isValue(target.type, Values.PiImplicit)) {
    return Values.TypedNeutral(
      applyClosure(target.type.retTypeClosure, arg),
      Neutrals.ApImplicit(target.neutral, TypedValue(target.type.argType, arg)),
    )
  }

  throw new EvaluationError(
    `doAp expect target.type to be Pi or ApImplicit, instead of: ${target.type.kind}`,
  )
}
