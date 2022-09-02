import pt from "@cicada-lang/partech"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import * as matchers from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:declare": ({ name, t }, { span }) =>
      new Stmts.Declare(pt.str(name), matchers.exp_matcher(t), span),
    "stmt:check": ({ exp, t }, { span }) =>
      new Stmts.Check(matchers.exp_matcher(exp), matchers.exp_matcher(t), span),
    "stmt:let": ({ name, exp }, { span }) =>
      new Stmts.Let(pt.str(name), matchers.exp_matcher(exp), span),
    "stmt:let_the": ({ name, t, exp }, { span }) =>
      new Stmts.LetThe(
        pt.str(name),
        matchers.exp_matcher(t),
        matchers.exp_matcher(exp),
        span
      ),
    "stmt:compute": ({ exp }, { span }) =>
      new Stmts.Compute(matchers.exp_matcher(exp), span),
  })(tree)
}
