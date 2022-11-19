import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import type { Exp } from "../../exp"
import * as Exps from "../../exp"
import * as Macros from "../../macros"

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:operator": ({ operator }) => operator_matcher(operator),
    "exp:operand": ({ operand }) => operand_matcher(operand),
  })(tree)
}

export function operator_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operator:var": ({ name }, { span }) => Exps.Var(pt.str(name), span),
    "operator:ap": ({ target, args_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(args_group)
        .map((args) => matchers.args_matcher(args))
        .reduce(
          (result, args) => Exps.ApUnfolded(result, args, span),
          operator_matcher(target),
        ),
    "operator:dot_field": ({ target, name }, { span }) =>
      Exps.Dot(operator_matcher(target), pt.str(name), span),
    "operator:dot_field_quote": ({ target, data }, { span }) =>
      Exps.Dot(
        operator_matcher(target),
        pt.trim_boundary(pt.str(data), 1),
        span,
      ),
    "operator:dot_method": ({ target, name, args_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(args_group)
        .map((args) => matchers.args_matcher(args))
        .reduce(
          (result: Exp, args) => Exps.ApUnfolded(result, args, span),
          Exps.Dot(
            operator_matcher(target),
            pt.str(name),
            pt.span_closure([target.span, name.span]),
          ),
        ),
    "operator:dot_method_quote": ({ target, data, args_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(args_group)
        .map((args) => matchers.args_matcher(args))
        .reduce(
          (result: Exp, args) => Exps.ApUnfolded(result, args, span),
          Exps.Dot(
            operator_matcher(target),
            pt.trim_boundary(pt.str(data), 1),
            pt.span_closure([target.span, data.span]),
          ),
        ),
    "operator:sequence": ({ sequence }, { span }) =>
      matchers.sequence_matcher(sequence),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": ({ bindings, ret_t }, { span }) =>
      Exps.PiUnfolded(
        matchers.pi_bindings_matcher(bindings),
        exp_matcher(ret_t),
        span,
      ),
    "operand:pi_forall": ({ bindings, ret_t }, { span }) =>
      Exps.PiUnfolded(
        matchers.pi_bindings_matcher(bindings),
        exp_matcher(ret_t),
        span,
      ),
    "operand:fn": ({ bindings, ret }, { span }) =>
      Exps.FnUnfolded(
        matchers.fn_bindings_matcher(bindings),
        exp_matcher(ret),
        span,
      ),
    "operand:fn_function": ({ bindings, sequence }, { span }) =>
      Exps.FnUnfolded(
        matchers.fn_bindings_matcher(bindings),
        matchers.sequence_matcher(sequence),
        span,
      ),
    "operand:fn_function_with_ret_type": (
      { bindings, ret_type, sequence },
      { span },
    ) =>
      Exps.FnUnfoldedWithRetType(
        matchers.fn_bindings_matcher(bindings),
        exp_matcher(ret_type),
        matchers.sequence_matcher(sequence),
        span,
      ),
    "operand:sigma_exists": ({ bindings, cdr_t }, { span }) =>
      Exps.SigmaUnfolded(
        matchers.sigma_bindings_matcher(bindings),
        matchers.exp_matcher(cdr_t),
        span,
      ),
    "operand:cons": ({ car, cdr }, { span }) =>
      Exps.Cons(exp_matcher(car), exp_matcher(cdr), span),
    "operand:quote": ({ data }, { span }) =>
      Exps.Quote(pt.trim_boundary(pt.str(data), 1), span),
    "operand:clazz": ({ bindings }, { span }) =>
      Exps.ClazzUnfolded(
        pt.matchers
          .zero_or_more_matcher(bindings)
          .map(matchers.clazz_binding_matcher),
        undefined,
        span,
      ),
    "operand:objekt": ({ properties, last_property }, { span }) =>
      Exps.ObjektUnfolded(
        [
          ...pt.matchers
            .zero_or_more_matcher(properties)
            .map(matchers.property_matcher),
          matchers.property_matcher(last_property),
        ],
        span,
      ),
    "operand:new": ({ name, properties, last_property }, { span }) =>
      Exps.NewUnfolded(
        pt.str(name),
        [
          ...pt.matchers
            .zero_or_more_matcher(properties)
            .map(matchers.property_matcher),
          matchers.property_matcher(last_property),
        ],
        span,
      ),
    "operand:new_ap": ({ name, args }, { span }) =>
      Exps.NewAp(pt.str(name), matchers.args_matcher(args), span),
    "operand:equivalent": ({ type, from, rest }, { span }) =>
      Exps.MacroExp(
        new Macros.Equivalent(
          matchers.exp_matcher(type),
          matchers.exp_matcher(from),
          pt.matchers
            .zero_or_more_matcher(rest)
            .map(matchers.equivalent_entry_matcher),
        ),
        span,
      ),
  })(tree)
}
