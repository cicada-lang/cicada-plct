import { AlphaCtx, alphaEquivalent, formatCore } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { readback, Value } from "../value"

/**

   # conversion

   `conversion` is implemented by `readback` and `alphaEquivalent`,
   not implemented directly by recursion over two values.

   Otherwise eta-rules will be tricky to handle.

**/

export function conversion(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  const leftCore = readback(mod, ctx, type, left)
  const rightCore = readback(mod, ctx, type, right)
  try {
    alphaEquivalent(new AlphaCtx(), leftCore, rightCore)
  } catch (error) {
    if (error instanceof Errors.ConversionError) {
      throw new Errors.InclusionError(
        [
          error.message,
          ` left: ${formatCore(leftCore)}`,
          ` right: ${formatCore(rightCore)}`,
        ].join("\n"),
      )
    }

    throw error
  }
}
