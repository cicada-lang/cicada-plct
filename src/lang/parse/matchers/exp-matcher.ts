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
    "operand:pi": pi_handler,
    "operand:pi_forall": pi_handler,
    "operand:fn": fn_handler,
    "operand:fn_function": fn_handler,
  })(tree)
}

type Typing = {
  kind: "named" // | "implicit" | "vague"
  name: string
  exp: Exp
  span: pt.Span
}

export function typings_matcher(tree: pt.Tree): Array<Typing> {
  return pt.matcher({
    "typings:typings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(typing_matcher),
      typing_matcher(last_entry),
    ],
  })(tree)
}

export function typing_matcher(tree: pt.Tree): Typing {
  return pt.matcher<Typing>({
    "typing:nameless": ({ exp }, { span }) => ({
      kind: "named",
      name: "_",
      exp: exp_matcher(exp),
      span,
    }),
    "typing:named": ({ name, exp }, { span }) => ({
      kind: "named",
      name: pt.str(name),
      exp: exp_matcher(exp),
      span,
    }),
    // "typing:implicit": ({ name, exp }, { span }) => ({
    //   kind: "implicit",
    //   name: pt.str(name),
    //   exp: exp_matcher(exp),
    //   span,
    // }),
    // "typing:vague": ({ name, exp }, { span }) => ({
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
  const { typings, ret_t } = body

  return typings_matcher(typings)
    .reverse()
    .reduce((result, typing) => {
      switch (typing.kind) {
        case "named": {
          return Exps.Pi(
            typing.name,
            typing.exp,
            result,
            pt.span_closure([typing.span, ret_t.span])
          )
        }
        // case "implicit": {
        //   return new Exps.ImplicitPi(typing.name, typing.exp, result, {
        //     span: pt.span_closure([typing.span, ret_t.span]),
        //   })
        // }
        // case "vague": {
        //   return new Exps.VaguePi(typing.name, typing.exp, result, {
        //     span: pt.span_closure([typing.span, ret_t.span]),
        //   })
        // }
      }
    }, exp_matcher(ret_t))
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
        // case "implicit": {
        //   return new Exps.ImplicitFn(naming.name, result, {
        //     span: pt.span_closure([naming.span, ret.span]),
        //   })
        // }
        // case "vague": {
        //   return new Exps.VagueFn(naming.name, result, {
        //     span: pt.span_closure([naming.span, ret.span]),
        //   })
        // }
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
  kind: "name" // | "implicit" | "vague"
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
    // "naming:implicit_naming": ({ name }, { span }) => ({
    //   kind: "implicit",
    //   name: pt.str(name),
    //   span,
    // }),
    // "naming:vague_naming": ({ name }, { span }) => ({
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
    "arg_entry:plain": ({ arg }) => Exps.ArgPlain(exp_matcher(arg)),
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
