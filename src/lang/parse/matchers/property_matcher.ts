import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function property_matcher(tree: pt.Tree): Exps.Property {
  return pt.matcher<Exps.Property>({
    "property:field_shorthand": ({ name }) =>
      Exps.PropertyPlain(pt.str(name), Exps.Var(pt.str(name))),
    "property:field": ({ name, exp }) =>
      Exps.PropertyPlain(pt.str(name), matchers.exp_matcher(exp)),
    "property:method": ({ name, bindings, sequence }) =>
      Exps.PropertyPlain(
        pt.str(name),
        Exps.FoldedFn(
          matchers.fn_bindings_matcher(bindings),
          matchers.sequence_matcher(sequence),
        ),
      ),
    "property:spread": ({ exp }) =>
      Exps.PropertySpread(matchers.exp_matcher(exp)),
  })(tree)
}
