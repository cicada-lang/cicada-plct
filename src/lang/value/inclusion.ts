import { Ctx } from "../ctx"
import * as Values from "../value"
import { conversion, Value } from "../value"

/**

   # Subtyping

   We use the word `inclusion` to name our function
   which implements the subtyping relation.
   Compare it with the word `conversion`
   for equivalent relation between types.

   `inclusion` is like `conversion`,
   but also handles subtyping between classes,
   -- simple attribute based subtype relation.

   `conversion` might be implemented directly,
   or implemented by `readback` and `alphaEquivalence`,

   We will not implement `Union` and `Intersection` types.

   We only use tagged union (sum type in ADT),
   -- which will be implemented by our induction datatypes.

**/

export function inclusion(ctx: Ctx, subtype: Value, type: Value): void {
  if (subtype.kind === "Pi" && type.kind === "Pi") {
    // TODO handle Pi
    console.log("[warning] inclusion for Pi is not implemented.")
    return
  }

  if (subtype.kind === "Sigma" && type.kind === "Sigma") {
    // TODO handle Sigma
    console.log("[warning] inclusion for Sigma is not implemented.")
    return
  }

  // if (isClazz(subtype) && isClazz(type)) {
  //   // TODO handle Clazz
  //   return
  // }

  conversion(ctx, Values.Type(), subtype, type)
}
