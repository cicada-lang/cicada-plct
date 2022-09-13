import pt from "@cicada-lang/partech"
import * as Stmts from "../../stmts"
import * as matchers from "../matchers"

export function equation_matcher(tree: pt.Tree): Stmts.Equation {
  return pt.matcher<Stmts.Equation>({
    "equation:equation": ({ left, right, type }, { span }) => ({
      left: matchers.exp_matcher(left),
      right: matchers.exp_matcher(right),
      type: matchers.exp_matcher(type),
    }),
  })(tree)
}
