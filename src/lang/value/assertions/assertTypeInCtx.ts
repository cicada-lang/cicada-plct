import { Ctx } from "../../ctx"
import * as Errors from "../../errors"
import { AlreadyType, Value } from "../../value"

type AlreadyTypeConstructor = (...args: Array<any>) => AlreadyType

/**

   TODO Given the `ctx`, we have the opportunity to `readback` the `value` and print it in error report.

**/

export function assertTypeInCtx<T extends AlreadyTypeConstructor>(
  ctx: Ctx,
  value: Value,
  alreadyTypeConstructor: T,
): asserts value is ReturnType<T> {
  const kind = alreadyTypeConstructor.name

  if (value.kind !== kind) {
    throw new Errors.AssertionError(
      `expect value to be type and to have kind: ${kind}, instead of: ${value.kind}`,
    )
  }
}
