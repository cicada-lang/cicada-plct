import * as pt from "@cicada-lang/partech"
import * as matchers from "./index.js"
import * as Exps from "../../exp/index.js"

export function sigma_binding_matcher(tree: pt.Tree): Exps.SigmaBinding {
  return pt.matcher<Exps.SigmaBinding>({
    "sigma_binding:nameless": ({ exp }, { span }) =>
      Exps.SigmaBindingNameless(matchers.exp_matcher(exp), span),
    "sigma_binding:named": ({ name, exp }, { span }) =>
      Exps.SigmaBindingNamed(pt.str(name), matchers.exp_matcher(exp), span),
  })(tree)
}

export function sigma_bindings_matcher(
  tree: pt.Tree,
): Array<Exps.SigmaBinding> {
  return pt.matcher({
    "sigma_bindings:sigma_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(sigma_binding_matcher),
      sigma_binding_matcher(last_entry),
    ],
  })(tree)
}
