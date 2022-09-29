import * as Errors from "../../errors"
import { Value } from "../../value"

type ValueConstructor = (...args: Array<any>) => Value

export function assertValue<T extends ValueConstructor>(
  value: Value,
  valueConstructor: T,
): asserts value is ReturnType<T> {
  const kind = valueConstructor.name

  if (value.kind !== kind) {
    throw new Errors.AssertionError(`expect value to have kind: ${kind}, instead of: ${value.kind}`)
  }
}
