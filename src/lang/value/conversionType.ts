import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Value } from "../value"

export function conversionType(ctx: Ctx, left: Value, right: Value): void {
  if (left.kind === "Type" && right.kind === "Type") {
    return
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return
  }

  if (left.kind === "String" && right.kind === "String") {
    return
  }

  if (left.kind === "Pi" && right.kind === "Pi") {
    // TODO handle Pi
    return
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    // TODO handle Pi
    return
  }

  if (left.kind === "ClazzCons" && right.kind === "ClazzCons") {
    // TODO handle ClazzCons
    return
  }

  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    if (left.neutral.kind === "Var" && right.neutral.kind === "Var") {
      if (left.neutral.name === right.neutral.name) {
        return
      } else {
        throw new ElaborationError(
          `expect variable: ${left.neutral.name} to be equal to variable: ${right.neutral.name}`,
        )
      }
    }

    // TODO handle other neutral cases.
  }

  throw new ElaborationError(
    `conversionType is not implemented for left: ${left.kind} and right: ${right.kind}`,
  )
}
