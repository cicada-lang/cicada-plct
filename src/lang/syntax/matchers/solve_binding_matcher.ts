import * as pt from "@cicada-lang/partech"
import type * as Stmts from "../../stmts/index.js"
import * as matchers from "./index.js"

export function solve_binding_matcher(tree: pt.Tree): Stmts.SolveBinding {
  return pt.matcher<Stmts.SolveBinding>({
    "solve_binding:named": ({ name, type }) => ({
      name: pt.str(name),
      type: matchers.exp_matcher(type),
    }),
  })(tree)
}

export function solve_bindings_matcher(
  tree: pt.Tree,
): Array<Stmts.SolveBinding> {
  return pt.matcher({
    "solve_bindings:solve_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(solve_binding_matcher),
      solve_binding_matcher(last_entry),
    ],
  })(tree)
}
