import { formatCore } from "../core"
import type { Ctx } from "../ctx"
import { AlphaCtx, alphaEquivalent } from "../equivalent"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import { readback } from "../readback"
import type { Value } from "../value"

/**

   # equivalent

   `equivalent` is implemented by `readback` and `alphaEquivalent`,
   not implemented directly by recursion over two values.

   Otherwise eta-rules will be tricky to handle.

**/

export function equivalent(
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
    if (error instanceof Errors.EquivalenceError) {
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
