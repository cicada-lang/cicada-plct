import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { conversionNeutral } from "../neutral"
import { Value } from "../value"

export function conversionByValue(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.literal === right.literal) {
      return
    } else {
      throw new ElaborationError(
        `String literal are not equal left: ${left.literal}. right: ${right.literal}`,
      )
    }
  }

  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type`, `left.type` and `right.type` are ignored here,
       maybe we should use them to debug.
      **/

    conversionNeutral(ctx, left.neutral, right.neutral)
    return
  }

  throw new ElaborationError(
    `conversion is not implemented for type: ${type.kind}, left: ${left.kind} and right: ${right.kind}`,
  )
}
