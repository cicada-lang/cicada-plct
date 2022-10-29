import * as pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function arg_matcher(tree: pt.Tree): Exps.Arg {
  return pt.matcher<Exps.Arg>({
    "arg:plain": ({ arg }) => Exps.ArgPlain(matchers.exp_matcher(arg)),
    "arg:implicit": ({ arg }) => Exps.ArgImplicit(matchers.exp_matcher(arg)),
  })(tree)
}

export function args_matcher(tree: pt.Tree): Array<Exps.Arg> {
  return pt.matcher({
    "args:args": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(arg_matcher),
      arg_matcher(last_entry),
    ],
  })(tree)
}
