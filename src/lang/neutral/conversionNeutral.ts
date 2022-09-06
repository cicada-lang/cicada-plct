import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Neutral } from "./Neutral"

export function conversionNeutral(
  ctx: Ctx,
  left: Neutral,
  right: Neutral,
): void {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name === right.name) {
      return
    } else {
      throw new ElaborationError(
        `expect variable: ${left.name} to be equal to variable: ${right.name}`,
      )
    }
  }

  throw new ElaborationError(
    `conversionNeutral is not implemented for left: ${left.kind} and right: ${right.kind}`,
  )
}
