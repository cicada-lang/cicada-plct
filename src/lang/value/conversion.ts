import { Ctx } from "../ctx"
import { conversionByType, conversionByValue, Value } from "../value"

export function conversion(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  const result = conversionByType(ctx, type, left, right)
  if (result === "ok") {
    return
  }

  conversionByValue(ctx, type, left, right)
}
