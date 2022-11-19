import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import type * as Macros from "../../macros"

export function equivalent_entry_matcher(
  tree: pt.Tree,
): Macros.EquivalentEntry {
  return pt.matcher<Macros.EquivalentEntry>({
    "equivalent_entry:via": ({ via, to }, { span }) => ({
      via: matchers.exp_matcher(via),
      to: matchers.exp_matcher(to),
      span,
    }),
    "equivalent_entry:via_refl": ({ to }, { span }) => ({
      to: matchers.exp_matcher(to),
      span,
    }),
  })(tree)
}
