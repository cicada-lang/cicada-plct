import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function clazz_binding_matcher(tree: pt.Tree): Exps.ClazzBinding {
  return pt.matcher<Exps.ClazzBinding>({
    "clazz_binding:field_abstract": ({ key, t }, { span }) =>
      Exps.ClazzBindingAbstract(
        matchers.key_matcher(key),
        matchers.exp_matcher(t),
      ),
    "clazz_binding:field_fulfilled": ({ key, t, exp }, { span }) =>
      Exps.ClazzBindingFulfilled(
        matchers.key_matcher(key),
        matchers.exp_matcher(t),
        matchers.exp_matcher(exp),
      ),
    "clazz_binding:method_abstract": ({ key, bindings, ret_t }, { span }) =>
      Exps.ClazzBindingAbstract(
        matchers.key_matcher(key),
        Exps.PiUnfolded(
          matchers.pi_bindings_matcher(bindings),
          matchers.exp_matcher(ret_t),
          span,
        ),
      ),
    "clazz_binding:method_fulfilled": (
      { key, bindings, ret_t, sequence },
      { span },
    ) =>
      Exps.ClazzBindingFulfilled(
        matchers.key_matcher(key),
        Exps.PiUnfolded(
          matchers.pi_bindings_matcher(bindings),
          matchers.exp_matcher(ret_t),
          span,
        ),
        Exps.FnUnfolded(
          matchers
            .pi_bindings_matcher(bindings)
            .map(matchers.piBindingtoFnBindingFrom),
          matchers.sequence_matcher(sequence),
          span,
        ),
      ),
  })(tree)
}
