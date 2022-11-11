import { formatCore } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { readbackType } from "../readback"
import { AlreadyType, Value } from "../value"

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
        `  found type: ${formatCore(readbackType(mod, ctx, type))}`,
      ].join("\n"),
    )
  }
}
