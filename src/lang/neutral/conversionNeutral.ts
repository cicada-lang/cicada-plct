import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Neutral } from "../neutral"
import { conversion, conversionType } from "../value"

export function conversionNeutral(
  ctx: Ctx,
  left: Neutral,
  right: Neutral,
): void {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name === right.name) return

    throw new ElaborationError(
      `expect variable: ${left.name} to be equal to variable: ${right.name}`,
    )
  }

  if (left.kind === "Ap" && right.kind === "Ap") {
    conversionNeutral(ctx, right.target, left.target)
    conversionType(ctx, right.arg.type, left.arg.type)
    const type = right.arg.type
    conversion(ctx, type, right.arg.value, left.arg.value)
  }

  if (left.kind === "Car" && right.kind === "Car") {
    conversionNeutral(ctx, right.target, left.target)
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    conversionNeutral(ctx, right.target, left.target)
  }

  if (left.kind === "Dot" && right.kind === "Dot") {
    conversionNeutral(ctx, right.target, left.target)
    if (left.name === right.name) return

    throw new ElaborationError(
      `expect property name: ${left.name} to be equal to property name: ${right.name}`,
    )
  }

  throw new ElaborationError(
    `conversionNeutral is not implemented for left: ${left.kind} and right: ${right.kind}`,
  )
}
