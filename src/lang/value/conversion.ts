import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Value } from "../value"

export function conversion(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value
): void {
  if (left.kind === "Type" && right.kind === "Type") {
    return
  }

  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    if (left.neutral.kind === "Var" && right.neutral.kind === "Var") {
      if (left.neutral.name === right.neutral.name) {
        return
      }
    }
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return
  }

  if (left.kind === "String" && right.kind === "String") {
    return
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.literal === right.literal) {
      return
    }
  }

  throw new ElaborationError(
    `conversion is not implemented for type: {type.kind}, left: ${left.kind} and right: ${right.kind}`
  )
}
