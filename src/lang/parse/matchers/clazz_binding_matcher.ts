import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import * as matchers from "../matchers"

export function clazz_binding_matcher(tree: pt.Tree): {
  field_name: string
  field_t: Exp
  field?: Exp
  span: pt.Span
} {
  return pt.matcher({
    "clazz_binding:field_demanded": ({ name, t }, { span }) => ({
      field_name: pt.str(name),
      field_t: matchers.exp_matcher(t),
      span,
    }),
    "clazz_binding:field_fulfilled": ({ name, t, exp }, { span }) => ({
      field_name: pt.str(name),
      field_t: matchers.exp_matcher(t),
      field: matchers.exp_matcher(exp),
      span,
    }),
    "clazz_binding:field_fulfilled_flower_bracket": (
      { name, t, exp },
      { span }
    ) => ({
      field_name: pt.str(name),
      field_t: matchers.exp_matcher(t),
      field: matchers.exp_matcher(exp),
      span,
    }),
    // "clazz_binding:method_demanded": ({ name, typings, ret_t }, { span }) => ({
    //   field_name: pt.str(name),
    //   field_t: pi_handler({ typings, ret_t }, { span }),
    //   span,
    // }),
  })(tree)
}
