import * as Errors from "../../errors"
import { Value } from "../../value"

export function assertValue<Kind extends Value["kind"]>(
  value: Value,
  kind: Kind,
): asserts value is Extract<Value, { kind: Kind }> {
  if (value.kind !== kind) {
    throw new Errors.AssertionError(
      `expect value to have kind: ${kind}, instead of: ${value.kind}`,
    )
  }
}
