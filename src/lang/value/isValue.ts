import { Value } from "./Value"

type ValueConstructor = (...args: Array<any>) => Value

export function isValue<T extends ValueConstructor>(
  value: Value,
  valueConstructor: T,
): value is ReturnType<T> {
  return value.kind === valueConstructor.name
}
