import { AlphaCtx, alphaEquivalent } from "../core"
import { Ctx } from "../ctx"
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
  alphaEquivalent(
    new AlphaCtx(),
    readback(mod, ctx, type, left),
    readback(mod, ctx, type, right),
  )
}
