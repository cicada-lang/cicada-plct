import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import { type AlreadyType, formatType, type Value } from "../value/index.js"

export function assertTypeInCtx<Kind extends AlreadyType["@kind"]>(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  kind: Kind,
): asserts type is Extract<Value, { "@kind": Kind }> {
  if (type["@kind"] !== kind) {
    throw new Errors.AssertionError(
      [
        `assertTypeInCtx fail`,
        `  expect type kind: ${kind}`,
        `  found type: ${formatType(mod, ctx, type)}`,
      ].join("\n"),
    )
  }
}
