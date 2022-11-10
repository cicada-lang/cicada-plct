import * as Errors from "../../errors"
import { Value } from "../../value"

type ElementExtractTypeUnion<Kinds extends Array<Value["kind"]>> =
  Kinds extends (infer Kind extends Value["kind"])[]
    ? Extract<Value, { kind: Kind }>
    : never

export function assertValues<Kinds extends Array<Value["kind"]>>(
  value: Value,
  kinds: Kinds,
): asserts value is ElementExtractTypeUnion<Kinds> {
  if (!kinds.includes(value.kind)) {
    throw new Errors.AssertionError(
      [
        `assertValues fail`,
        `  expect value kinds: ${kinds}`,
        `  found value kind: ${value.kind}`,
      ].join("\n"),
    )
  }
}
