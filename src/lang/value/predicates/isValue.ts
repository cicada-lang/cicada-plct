import { Value } from "../../value"

export function isValue<Kind extends Value["kind"]>(
  value: Value,
  kind: Kind,
): value is Extract<Value, { kind: Kind }> {
  return value.kind === kind
}
