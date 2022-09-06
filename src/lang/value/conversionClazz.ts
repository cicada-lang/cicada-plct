import { Ctx } from "../ctx"
import * as Values from "../value"

/**

   # Comparing out of order Clazzes

   To compare out of order `Clazz`es,
   all we need is to compute the `localNames` first,
   because for example, in the case of `Sigma` in `conversionType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

**/

export function conversionClazz(
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  return
}
