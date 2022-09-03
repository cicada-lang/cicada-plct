import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function clazz_binding_matcher(tree: pt.Tree): Exps.ClazzBinding {
  return pt.matcher<Exps.ClazzBinding>({
    "clazz_binding:field_abstract": ({ name, t }, { span }) =>
      Exps.ClazzBindingAbstract(pt.str(name), matchers.exp_matcher(t)),
    "clazz_binding:field_fulfilled": ({ name, t, exp }, { span }) =>
      Exps.ClazzBindingFulfilled(
        pt.str(name),
        matchers.exp_matcher(t),
        matchers.exp_matcher(exp),
      ),
    "clazz_binding:method_abstract": ({ name, pi_bindings, ret_t }, { span }) =>
      Exps.ClazzBindingAbstract(
        pt.str(name),
        Exps.FoldedPi(
          matchers.pi_bindings_matcher(pi_bindings),
          matchers.exp_matcher(ret_t),
          span,
        ),
      ),
  })(tree)
}
