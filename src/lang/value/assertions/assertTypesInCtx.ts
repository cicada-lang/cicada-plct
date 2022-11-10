import { Ctx } from "../../ctx"
import * as Errors from "../../errors"
import { Mod } from "../../mod"
import { AlreadyType, Value } from "../../value"

/**

   TODO Given the `ctx`, we have the opportunity to `readback` the `value` and print it in error report.

**/

type ElementExtractTypeUnion<Kinds extends Array<AlreadyType["kind"]>> =
  Kinds extends (infer Kind extends AlreadyType["kind"])[]
    ? Extract<Value, { kind: Kind }>
    : never

export function assertTypesInCtx<Kinds extends Array<AlreadyType["kind"]>>(
  mod: Mod,
  ctx: Ctx,
  value: Value,
  kinds: Kinds,
): asserts value is ElementExtractTypeUnion<Kinds> {
  if (!kinds.includes(value.kind as any)) {
    throw new Errors.AssertionError(
      `expect value to be type and to have kind: ${kinds}, instead of: ${value.kind}`,
    )
  }
}
