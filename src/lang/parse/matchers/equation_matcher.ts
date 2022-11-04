import * as pt from "@cicada-lang/partech"
import * as Stmts from "../../stmts"
import * as matchers from "../matchers"

export function equation_matcher(tree: pt.Tree): Stmts.Equation {
  return pt.matcher<Stmts.Equation>({
    "equation:unify_typed": ({ left, right, type }, { span }) =>
      Stmts.EquationUnifyTyped(
        matchers.exp_matcher(left),
        matchers.exp_matcher(right),
        matchers.exp_matcher(type),
      ),
    "equation:unify": ({ left, right }, { span }) =>
      Stmts.EquationUnify(
        matchers.exp_matcher(left),
        matchers.exp_matcher(right),
      ),
  })(tree)
}
