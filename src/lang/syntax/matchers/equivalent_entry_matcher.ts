import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import type * as Exps from "../../exp"

export function equivalent_entry_matcher(tree: pt.Tree): Exps.EquivalentEntry {
  return pt.matcher<Exps.EquivalentEntry>({
    "equivalent_entry:via": ({ via, to }, { span }) => ({
      via: matchers.exp_matcher(via),
      to: matchers.exp_matcher(to),
    }),
    "equivalent_entry:via_refl": ({ to }, { span }) => ({
      to: matchers.exp_matcher(to),
    }),
  })(tree)
}
