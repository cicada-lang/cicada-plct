import pt from "@cicada-lang/partech"
import * as Exps from "../../Exp"
import { Exp } from "../../Exp"

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
          (result, arg_entries) => Exps.Ap(result, arg_entries, span),
          operator_matcher(target)
        ),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": ({ typings, ret_t }, { span }) =>
      Exps.Pi(typings_matcher(typings), exp_matcher(ret_t), span),
    "operand:pi_forall": ({ typings, ret_t }, { span }) =>
      Exps.Pi(typings_matcher(typings), exp_matcher(ret_t), span),
    "operand:fn": fn_handler,
    "operand:fn_function": fn_handler,
  })(tree)
}

export function typings_matcher(tree: pt.Tree): Array<Exps.PiBinding> {
  return pt.matcher({
    "typings:typings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(typing_matcher),
      typing_matcher(last_entry),
    ],
  })(tree)
}

export function typing_matcher(tree: pt.Tree): Exps.PiBinding {
  return pt.matcher<Exps.PiBinding>({
    "typing:nameless": ({ exp }) => Exps.PiBindingNameless(exp_matcher(exp)),
    "typing:named": ({ name, exp }) =>
      Exps.PiBindingNamed(pt.str(name), exp_matcher(exp)),
  })(tree)
}

export function fn_handler(body: { [key: string]: pt.Tree }): Exp {
  const { namings, ret } = body

  return namings_matcher(namings)
    .reverse()
    .reduce((result, naming) => {
      switch (naming.kind) {
        case "name": {
          return Exps.Fn(
            naming.name,
            result,
            pt.span_closure([naming.span, ret.span])
          )
        }
      }
    }, exp_matcher(ret))
}

export function namings_matcher(tree: pt.Tree): Array<Naming> {
  return pt.matcher({
    "namings:namings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(naming_matcher),
      naming_matcher(last_entry),
    ],
    "namings:namings_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(naming_matcher),
      naming_matcher(last_entry),
    ],
  })(tree)
}

type Naming = {
  kind: "name"
  name: string
  span: pt.Span
}

export function naming_matcher(tree: pt.Tree): Naming {
  return pt.matcher<Naming>({
    "naming:naming": ({ name }, { span }) => ({
      kind: "name",
      name: pt.str(name),
      span,
    }),
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
