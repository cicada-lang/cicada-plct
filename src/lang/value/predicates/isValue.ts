import { Value } from "../../value"

type ValueConstructor = (...args: Array<any>) => Value

export function isValue<Kind extends string>(
  value: Value,
  kind: Kind,
): value is Extract<Value, { kind: Kind }> {
  return value.kind === kind
}
