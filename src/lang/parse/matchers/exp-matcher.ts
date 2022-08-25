import pt from "@cicada-lang/partech"
import { Exp } from "../../Exp"
import * as Exps from "../../Exp"

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
    "operand:pi": pi_handler,
    "operand:pi_forall": pi_handler,
    "operand:fn": fn_handler,
    "operand:fn_function": fn_handler,
  })(tree)
}

type Binding = {
  kind: "named" // | "implicit" | "vague"
  name: string
  exp: Exp
  span: pt.Span
}

export function bindings_matcher(tree: pt.Tree): Array<Binding> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_matcher),
      binding_matcher(last_entry),
    ],
  })(tree)
}

export function binding_matcher(tree: pt.Tree): Binding {
  return pt.matcher<Binding>({
    "binding:nameless": ({ exp }, { span }) => ({
      kind: "named",
      name: "_",
      exp: exp_matcher(exp),
      span,
    }),
    "binding:named": ({ name, exp }, { span }) => ({
      kind: "named",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    // "binding:implicit": ({ name, exp }, { span }) => ({
    //   kind: "implicit",
    //   name: pt.str(name),
    //   exp: exp_matcher(exp),
    //   span,
    // }),
    // "binding:vague": ({ name, exp }, { span }) => ({
    //   kind: "vague",
    //   name: pt.str(name),
    //   exp: exp_matcher(exp),
    //   span,
    // }),
  })(tree)
}

export function pi_handler(
  body: { [key: string]: pt.Tree },
  meta: { span: pt.Span }
): Exp {
  const { bindings, ret_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .reduce((result, binding) => {
      switch (binding.kind) {
        case "named": {
          return Exps.Pi(
            binding.name,
            binding.exp,
            result,
            pt.span_closure([binding.span, ret_t.span])
          )
        }
        // case "implicit": {
        //   return new Exps.ImplicitPi(binding.name, binding.exp, result, {
        //     span: pt.span_closure([binding.span, ret_t.span]),
        //   })
        // }
        // case "vague": {
        //   return new Exps.VaguePi(binding.name, binding.exp, result, {
        //     span: pt.span_closure([binding.span, ret_t.span]),
        //   })
        // }
      }
    }, exp_matcher(ret_t))
}

export function fn_handler(body: { [key: string]: pt.Tree }): Exp {
  const { names, ret } = body

  return names_matcher(names)
    .reverse()
    .reduce((result, name_entry) => {
      switch (name_entry.kind) {
        case "name": {
          return Exps.Fn(
            name_entry.name,
            result,
            pt.span_closure([name_entry.span, ret.span])
          )
        }
        // case "implicit": {
        //   return new Exps.ImplicitFn(name_entry.name, result, {
        //     span: pt.span_closure([name_entry.span, ret.span]),
        //   })
        // }
        // case "vague": {
        //   return new Exps.VagueFn(name_entry.name, result, {
        //     span: pt.span_closure([name_entry.span, ret.span]),
        //   })
        // }
      }
    }, exp_matcher(ret))
}

export function names_matcher(tree: pt.Tree): Array<NameEntry> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
    "names:names_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
  })(tree)
}

type NameEntry = {
  kind: "name" // | "implicit" | "vague"
  name: string
  span: pt.Span
}

export function name_entry_matcher(tree: pt.Tree): NameEntry {
  return pt.matcher<NameEntry>({
    "name_entry:name_entry": ({ name }, { span }) => ({
      kind: "name",
      name: pt.str(name),
      span,
    }),
    // "name_entry:implicit_name_entry": ({ name }, { span }) => ({
    //   kind: "implicit",
    //   name: pt.str(name),
    //   span,
    // }),
    // "name_entry:vague_name_entry": ({ name }, { span }) => ({
    //   kind: "vague",
    //   name: pt.str(name),
    //   span,
    // }),
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
    "arg_entry:plain": ({ arg }) => ({
      kind: "plain",
      exp: exp_matcher(arg),
    }),
    // "arg_entry:implicit": ({ arg }) => ({
    //   kind: "implicit",
    //   exp: exp_matcher(arg),
    // }),
    // "arg_entry:vague": ({ arg }) => ({
    //   kind: "vague",
    //   exp: exp_matcher(arg),
    // }),
  })(tree)
}
