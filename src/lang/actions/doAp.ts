import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, isValue, Value } from "../value"

export function doAp(target: Value, arg: Value): Value {
  if (isValue(target, Values.Fn)) {
    return applyClosure(target.retClosure, arg)
  }

  // if (!isValue(target, Values.NotYet)) {
  //   throw InternalError.wrong_target(target, {
  //     expected: [Exps.FnValue, Exps.NilClsValue, Exps.ConsClsValue],
  //   })
  // }

  // if (!isValue(target.type, Values.Pi)) {
  //   throw InternalError.wrong_target_t(target.t, {
  //     expected: [Exps.PiValue],
  //   })
  // }

  // return Values.NotYet(
  //   applyClosure(target.type.retTypeClosure, arg),
  //   Neutrals.Ap(target.neutral, new Normal(target.type.argType, arg))
  // )

  throw new Error("TODO")
}
