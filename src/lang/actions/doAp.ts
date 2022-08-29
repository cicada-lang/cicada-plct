import * as Values from "../value"
import * as Neutrals from "../neutral"
import { applyClosure, isValue, TypedValue, Value } from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (isValue(target, Values.Fn)) {
    return applyClosure(target.retClosure, arg)
  }

  if (!isValue(target, Values.NotYetValue)) {
    throw new Error("TODO")
    // throw InternalError.wrong_target(target, {
    //   expected: [Exps.FnValue, Exps.NilClsValue, Exps.ConsClsValue],
    // })
  }

  if (!isValue(target.type, Values.Pi)) {
    throw new Error("TODO")
    // throw InternalError.wrong_target_t(target.t, {
    //   expected: [Exps.PiValue],
    // })
  }

  return Values.NotYetValue(
    applyClosure(target.type.retTypeClosure, arg),
    Neutrals.Ap(target.neutral, TypedValue(target.type.argType, arg))
  )


}
