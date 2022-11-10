import { Ctx } from "../../ctx"
import * as Errors from "../../errors"
import { Mod } from "../../mod"
import { AlreadyType, Value } from "../../value"

/**

   TODO Given the `ctx`, we have the opportunity to `readback` the `value` and print it in error report.

**/

export function assertTypeInCtx<Kind extends AlreadyType["kind"]>(
  mod: Mod,
  ctx: Ctx,
  value: Value,
  kind: Kind,
): asserts value is Extract<Value, { kind: Kind }> {
  if (value.kind !== kind) {
    throw new Errors.AssertionError(
      `expect value to be type and to have kind: ${kind}, instead of: ${value.kind}`,
    )
  }
}
