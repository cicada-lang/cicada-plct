import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import { Exp } from "../../exp"

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:operator": ({ operator }) => operator_matcher(operator),
    "exp:operand": ({ operand }) => operand_matcher(operand),
  })(tree)
}

export function operator_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operator:var": ({ name }, { span }) => Exps.Var(pt.str(name), span),
    "operator:ap": ({ target, arg_entries_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(arg_entries_group)
        .map((arg_entries) => arg_entries_matcher(arg_entries))
        .reduce(
          (result, arg_entries) => Exps.MultiAp(result, arg_entries, span),
          operator_matcher(target)
        ),
    "operator:car": ({ target }, { span }) =>
      Exps.Car(exp_matcher(target), span),
    "operator:cdr": ({ target }, { span }) =>
      Exps.Cdr(exp_matcher(target), span),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": ({ pi_bindings, ret_t }, { span }) =>
      Exps.MultiPi(pi_bindings_matcher(pi_bindings), exp_matcher(ret_t), span),
    "operand:pi_forall": ({ pi_bindings, ret_t }, { span }) =>
      Exps.MultiPi(pi_bindings_matcher(pi_bindings), exp_matcher(ret_t), span),
    "operand:fn": ({ fn_bindings, ret }, { span }) =>
      Exps.MultiFn(fn_bindings_matcher(fn_bindings), exp_matcher(ret), span),
    "operand:fn_function": ({ fn_bindings, ret }, { span }) =>
      Exps.MultiFn(fn_bindings_matcher(fn_bindings), exp_matcher(ret), span),
    "operand:sigma_exists": ({ sigma_bindings, cdr_t }, { span }) =>
      Exps.MultiSigma(
        sigma_bindings_matcher(sigma_bindings),
        exp_matcher(cdr_t),
        span
      ),
    "operand:cons": ({ car, cdr }, { span }) =>
      Exps.Cons(exp_matcher(car), exp_matcher(cdr), span),
    "operand:quote": ({ literal }, { span }) =>
      Exps.Quote(pt.trim_boundary(pt.str(literal), 1), span),
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

export function pi_binding_matcher(tree: pt.Tree): Exps.PiBinding {
  return pt.matcher<Exps.PiBinding>({
    "pi_binding:nameless": ({ exp }) =>
      Exps.PiBindingNameless(exp_matcher(exp)),
    "pi_binding:named": ({ name, exp }) =>
      Exps.PiBindingNamed(pt.str(name), exp_matcher(exp)),
  })(tree)
}

export function fn_bindings_matcher(tree: pt.Tree): Array<Exps.FnBinding> {
  return pt.matcher({
    "fn_bindings:fn_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(fn_binding_matcher),
      fn_binding_matcher(last_entry),
    ],
    "fn_bindings:fn_bindings_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(fn_binding_matcher),
      fn_binding_matcher(last_entry),
    ],
  })(tree)
}

export function fn_binding_matcher(tree: pt.Tree): Exps.FnBinding {
  return pt.matcher<Exps.FnBinding>({
    "fn_binding:name": ({ name }, { span }) => Exps.FnBindingName(pt.str(name)),
    "fn_binding:annotated": ({ name, t }, { span }) =>
      Exps.FnBindingAnnotated(pt.str(name), exp_matcher(t)),
  })(tree)
}

export function sigma_bindings_matcher(
  tree: pt.Tree
): Array<Exps.SigmaBinding> {
  return pt.matcher({
    "sigma_bindings:sigma_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(sigma_binding_matcher),
      sigma_binding_matcher(last_entry),
    ],
  })(tree)
}

export function sigma_binding_matcher(tree: pt.Tree): Exps.SigmaBinding {
  return pt.matcher<Exps.SigmaBinding>({
    "sigma_binding:nameless": ({ exp }) =>
      Exps.SigmaBindingNameless(exp_matcher(exp)),
    "sigma_binding:named": ({ name, exp }) =>
      Exps.SigmaBindingNamed(pt.str(name), exp_matcher(exp)),
  })(tree)
}

export function arg_entries_matcher(tree: pt.Tree): Array<Exps.Arg> {
  return pt.matcher({
    "arg_entries:arg_entries": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(arg_entry_matcher),
      arg_entry_matcher(last_entry),
    ],
  })(tree)
}

export function arg_entry_matcher(tree: pt.Tree): Exps.Arg {
  return pt.matcher<Exps.Arg>({
    "arg_entry:plain": ({ arg }) => Exps.ArgPlain(exp_matcher(arg)),
  })(tree)
}
