import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import { Exp } from "../../exp"
import * as matchers from "../matchers"

export function property_matcher(tree: pt.Tree): [string, Exp] {
  return pt.matcher<[string, Exp]>({
    "property:field_shorthand": ({ name }) => [
      pt.str(name),
      Exps.Var(pt.str(name)),
    ],
    "property:field": ({ name, exp }) => [
      pt.str(name),
      matchers.exp_matcher(exp),
    ],
    "property:method": ({ name, bindings, sequence }) => [
      pt.str(name),
      Exps.FoldedFn(
        matchers.fn_bindings_matcher(bindings),
        matchers.sequence_matcher(sequence),
      ),
    ],
  })(tree)
}
