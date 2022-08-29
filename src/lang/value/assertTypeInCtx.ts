import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Value } from "./Value"

type ValueConstructor = (...args: Array<any>) => Value

/**

   # assertTypeInCtx

   Given the `ctx`, we have the opportunity
   to `readback` the `value` and print it in error report.

**/

export function assertTypeInCtx<T extends ValueConstructor>(
  ctx: Ctx,
  value: Value,
  valueConstructor: T
): asserts value is ReturnType<T> {
  const kind = valueConstructor.name

  if (value.kind !== kind) {
    throw new ElaborationError(
      `expect value to have kind: ${kind}, instead of: ${value.kind}`
    )
  }
}
