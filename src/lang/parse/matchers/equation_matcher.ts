import pt from "@cicada-lang/partech"
import * as Stmts from "../../stmts"
import * as matchers from "../matchers"

export function equation_matcher(tree: pt.Tree): Stmts.Equation {
  return pt.matcher<Stmts.Equation>({
    "equation:typed": ({ left, right, type }, { span }) =>
      Stmts.EquationTyped(
        matchers.exp_matcher(left),
        matchers.exp_matcher(right),
        matchers.exp_matcher(type),
      ),
    "equation:untyped": ({ left, right }, { span }) =>
      Stmts.EquationUntyped(
        matchers.exp_matcher(left),
        matchers.exp_matcher(right),
      ),
  })(tree)
}
