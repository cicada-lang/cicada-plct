import { Ctx } from "../ctx"
import { conversionByType, conversionByValue, Value } from "../value"

/**

   # conversion

   The resursion structure of `conversion`
   closely follows that of `readback`,
   just two values together.

**/

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
