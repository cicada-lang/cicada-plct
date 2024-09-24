import { indent } from "../../utils/indent.js"
import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import { unify, unifyNeutral, unifyType } from "../unify/index.js"
import type { Value } from "../value/index.js"
import { formatType, formatValue } from "../value/index.js"

export function unifyByValue(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  if (left["@kind"] === "TypedNeutral" && right["@kind"] === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    unifyNeutral(mod, ctx, left.type, left.neutral, right.neutral)
    return
  }

  if (left["@kind"] === "Sole" && right["@kind"] === "Sole") {
    return
  }

  if (left["@kind"] === "Quote" && right["@kind"] === "Quote") {
    if (left.data === right.data) {
      return
    }

    throw new Errors.UnificationError(
      [
        `[unifyByValue] expect strings to be the same`,
        `  left: ${left.data}`,
        `  right: ${right.data}`,
      ].join("\n"),
    )
  }

  if (left["@kind"] === "Refl" && right["@kind"] === "Refl") {
    unifyType(mod, ctx, left.type, right.type)
    unify(mod, ctx, left.type, left.value, right.value)
    return
  }

  throw new Errors.UnificationError(
    [
      `[unifyByValue] is not implemented for the pair of values`,
      indent(`type: ${formatType(mod, ctx, type)}`),
      indent(`left: ${formatValue(mod, ctx, type, left)}`),
      indent(`right: ${formatValue(mod, ctx, type, right)}`),
    ].join("\n"),
  )
}
