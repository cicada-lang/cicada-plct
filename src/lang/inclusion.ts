import { Ctx } from "./Ctx"
import { Value } from "./Value"

// NOTE About subtyping.
// - We use the word `inclusion` to name our function which implements the subtyping relation.
//   Comparing with the word `conversion` for equivalent relation between types.
// - `inclusion` is like `conversion`, but also handles subtyping between classes.
//   - simple attribute based subtype relation.
// - `conversion` is like implementing `readback` and `alphaEquivalence` at once.
// - We will not implement `Union` and `Intersection` types.
//   - We only use tagged union (sum type in ADT),
//     - which will be implemented by induction datatypes.

export function inclusion(ctx: Ctx, subtype: Value, type: Value): void {
  throw new Error("TODO")
}
