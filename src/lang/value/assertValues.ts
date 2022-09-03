import { ElaborationError } from "../errors"
import { Value } from "../value"

type ValueConstructor = (...args: Array<any>) => Value

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
