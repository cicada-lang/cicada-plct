import { Ctx } from "../ctx"
import { conversionByType, conversionByValue, Value } from "../value"

/**

   # conversion

   `conversion` is implemented by `readback` and `alphaEquivalent`,
   not implemented directly by recursion over two values.

   Otherwise eta-rules will be tricky to handle.

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
