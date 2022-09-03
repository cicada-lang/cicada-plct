import { ElaborationError } from "../errors"
import * as Values from "./Value"
import { Value } from "./Value"

type ValueConstructor = (...args: Array<any>) => Value

export function assertValue<T extends ValueConstructor>(
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

type ElementReturnTypeUnion<T extends Array<ValueConstructor>> =
  T extends (infer E extends ValueConstructor)[] ? ReturnType<E> : never

export function assertValues<T extends Array<ValueConstructor>>(
  value: Value,
  valueConstructors: T
): asserts value is ElementReturnTypeUnion<T> {
  const kinds = valueConstructors.map((x) => x.name)

  if (!kinds.includes(value.kind)) {
    throw new ElaborationError(
      `expect value to have kind: ${kinds}, instead of: ${value.kind}`
    )
  }
}

export function assertClazz(value: Value): asserts value is Values.Clazz {
  assertValues(value, [
    Values.ClazzNull,
    Values.ClazzCons,
    Values.ClazzFulfilled,
  ])
}
