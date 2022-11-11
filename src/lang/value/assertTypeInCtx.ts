import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { AlreadyType, safeFormatType, Value } from "../value"

export function assertTypeInCtx<Kind extends AlreadyType["kind"]>(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  kind: Kind,
): asserts type is Extract<Value, { kind: Kind }> {
  if (type.kind !== kind) {
    throw new Errors.AssertionError(
      [
        `assertTypeInCtx fail`,
        `  expect type kind: ${kind}`,
        `  found type: ${safeFormatType(mod, ctx, type)}`,
      ].join("\n"),
    )
  }
}
