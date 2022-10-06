import { Value } from "../value"

export function doReplace(target: Value, motive: Value, base: Value): Value {
  throw new Error("TODO")

  // if (Values.isValue(target, "Fn")) {
  //   return applyClosure(target.retClosure, arg)
  // }

  // if (Values.isClazz(target)) {
  //   return Values.fulfillClazz(target, arg)
  // }

  // Values.assertValue(target, "TypedNeutral")
  // Values.assertValue(target.type, "Pi")

  // return Values.TypedNeutral(
  //   applyClosure(target.type.retTypeClosure, arg),
  //   Neutrals.Ap(target.neutral, target.type, TypedValue(target.type.argType, arg)),
  // )
}
