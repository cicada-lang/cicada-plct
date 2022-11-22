import { indent } from "../../utils/indent"
import type { Ctx } from "../ctx"
import { equivalent, equivalentNeutral, equivalentType } from "../equivalent"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import type { Value } from "../value"
import { formatType, formatValue } from "../value"

export function equivalentByValue(
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

    equivalentNeutral(mod, ctx, left.type, left.neutral, right.neutral)
    return
  }

  if (left["@kind"] === "Sole" && right["@kind"] === "Sole") {
    return
  }

  if (left["@kind"] === "Quote" && right["@kind"] === "Quote") {
    if (left.data === right.data) {
      return
    }

    throw new Errors.EquivalenceError(
      [
        `[equivalentByValue] expect strings to be the same`,
        `  left: ${left.data}`,
        `  right: ${right.data}`,
      ].join("\n"),
    )
  }

  if (left["@kind"] === "Refl" && right["@kind"] === "Refl") {
    equivalentType(mod, ctx, left.type, right.type)
    equivalent(mod, ctx, left.type, left.value, right.value)
    return
  }

  throw new Errors.EquivalenceError(
    [
      `[equivalentByValue] is not implemented for the pair of values`,
      indent(`type: ${formatType(mod, ctx, type)}`),
      indent(`left: ${formatValue(mod, ctx, type, left)}`),
      indent(`right: ${formatValue(mod, ctx, type, right)}`),
    ].join("\n"),
  )
}
