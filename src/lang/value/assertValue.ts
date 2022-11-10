import * as Errors from "../errors"
import { Value } from "../value"

export function assertValue<Kind extends Value["kind"]>(
  value: Value,
  kind: Kind,
): asserts value is Extract<Value, { kind: Kind }> {
  if (value.kind !== kind) {
    throw new Errors.AssertionError(
      [
        `assertValue fail`,
        `  expect value kind: ${kind}`,
        `  found value kind: ${value.kind}`,
      ].join("\n"),
    )
  }
}
