import { Ctx } from "../ctx"
import { Value } from "../value"

/**

   # Subtyping

   We use the word `inclusion` to name our function
   which implements the subtyping relation.
   Compare it with the word `conversion`
   for equivalent relation between types.

   `inclusion` is like `conversion`,
   but also handles subtyping between classes,
   -- simple attribute based subtype relation.

   `conversion` is implemented by `readback` and `alphaEquivalence`.

   We will not implement `Union` and `Intersection` types.

   We only use tagged union (sum type in ADT),
   -- which will be implemented by our induction datatypes.

**/

export function inclusion(ctx: Ctx, subtype: Value, type: Value): void {
  if (subtype.kind === "Global" && type.kind === "Global") {
    if (subtype.name === "Type" && type.name === "Type") {
      return
    }
  }

  if (subtype.kind === "TypedNeutral" && type.kind === "TypedNeutral") {
    if (subtype.neutral.kind === "Var" && type.neutral.kind === "Var") {
      if (subtype.neutral.name === type.neutral.name) {
        return
      }
    }
  }

  throw new Error(
    `inclusion is not implemented for subtype: ${subtype.kind} and type: ${type.kind}`
  )
}
