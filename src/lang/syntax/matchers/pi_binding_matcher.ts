import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import * as Exps from "../../exp"

export function pi_binding_matcher(tree: pt.Tree): Exps.PiBinding {
  return pt.matcher<Exps.PiBinding>({
    "pi_binding:nameless": ({ exp }, { span }) =>
      Exps.PiBindingNameless(matchers.exp_matcher(exp), span),
    "pi_binding:named": ({ name, exp }, { span }) =>
      Exps.PiBindingNamed(pt.str(name), matchers.exp_matcher(exp), span),
    "pi_binding:implicit": ({ name, exp }, { span }) =>
      Exps.PiBindingImplicit(pt.str(name), matchers.exp_matcher(exp), span),
  })(tree)
}

export function pi_bindings_matcher(tree: pt.Tree): Array<Exps.PiBinding> {
  return pt.matcher({
    "pi_bindings:pi_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(pi_binding_matcher),
      pi_binding_matcher(last_entry),
    ],
  })(tree)
}
