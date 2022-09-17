import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function property_matcher(tree: pt.Tree): Exps.Property {
  return pt.matcher<Exps.Property>({
    "property:field_shorthand": ({ key }) =>
      Exps.PropertyPlain(
        matchers.key_matcher(key),
        Exps.Var(matchers.key_matcher(key)),
      ),
    "property:field": ({ key, exp }) =>
      Exps.PropertyPlain(matchers.key_matcher(key), matchers.exp_matcher(exp)),
    "property:method": ({ key, bindings, sequence }) =>
      Exps.PropertyPlain(
        matchers.key_matcher(key),
        Exps.FoldedFn(
          matchers.fn_bindings_matcher(bindings),
          matchers.sequence_matcher(sequence),
        ),
      ),
    "property:spread": ({ exp }) =>
      Exps.PropertySpread(matchers.exp_matcher(exp)),
  })(tree)
}
