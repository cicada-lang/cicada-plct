import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { conversionType, Value } from "../value"

export function conversion(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  const result = typeDirectedConversion(ctx, type, left, right)
  if (result === "ok") {
    return
  }

  valueDirectedConversion(ctx, type, left, right)
}

export function typeDirectedConversion(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  switch (type.kind) {
    case "Type": {
      conversionType(ctx, left, right)
      return "ok"
    }
  }
}

export function valueDirectedConversion(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  if (left.kind === "Sole" && right.kind === "Sole") {
    return
  }

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
    `conversion is not implemented for type: ${type.kind}, left: ${left.kind} and right: ${right.kind}`,
  )
}
