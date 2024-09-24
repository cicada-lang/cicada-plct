import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import { type AlreadyType, formatType, type Value } from "../value/index.js"

type ElementExtractTypeUnion<Kinds extends Array<AlreadyType["@kind"]>> =
  Kinds extends (infer Kind extends AlreadyType["@kind"])[]
    ? Extract<Value, { "@kind": Kind }>
    : never

export function assertTypesInCtx<Kinds extends Array<AlreadyType["@kind"]>>(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  kinds: Kinds,
): asserts type is ElementExtractTypeUnion<Kinds> {
  if (!kinds.includes(type["@kind"] as any)) {
    throw new Errors.AssertionError(
      [
        `assertTypesInCtx fail`,
        `  expect value kinds: ${kinds.join(", ")}`,
        `  found type: ${formatType(mod, ctx, type)}`,
      ].join("\n"),
    )
  }
}
