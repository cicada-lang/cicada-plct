import pt from "@cicada-lang/partech"
import { Exp } from "../../Exp"
import * as Exps from "../../Exp"

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    // "exp:operator": ({ operator }) => operator_matcher(operator),
    // "exp:operand": ({ operand }) => operand_matcher(operand),
  })(tree)
}
