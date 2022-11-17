import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import * as Exps from "../../exp"

export function equivalent_rest_entry_matcher(
  tree: pt.Tree,
): Exps.EquivalentEntry {
  return pt.matcher<Exps.EquivalentEntry>({
    "equivalent_rest_entry:via": ({ via, to }, { span }) =>
      Exps.EquivalentEntryVia(
        matchers.exp_matcher(via),
        matchers.exp_matcher(to),
      ),
    // "equivalent_rest_entry:via_refl": ({ to }, { span }) =>
    //   Exps.EquivalentEntryViaRefl(matchers.exp_matcher(to)),
  })(tree)
}
