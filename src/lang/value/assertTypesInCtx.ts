import { formatCore } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { AlreadyType, readbackType, Value } from "../value"

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
  type: Value,
  kinds: Kinds,
): asserts type is ElementExtractTypeUnion<Kinds> {
  if (!kinds.includes(type.kind as any)) {
    throw new Errors.AssertionError(
      [
        `assertTypesInCtx fail`,
        `  expect value kinds: ${kinds.join(", ")}`,
        `  found type: ${formatCore(readbackType(mod, ctx, type))}`,
      ].join("\n"),
    )
  }
}
