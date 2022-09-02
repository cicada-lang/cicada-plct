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
  })(tree)
}