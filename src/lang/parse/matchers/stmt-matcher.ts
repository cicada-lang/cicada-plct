import pt from "@cicada-lang/partech"
import { Stmt } from "../../Stmt"
import * as Stmts from "../../stmts"
import { exp_matcher } from "../matchers"

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:declare": ({ name, t }, { span }) =>
      new Stmts.Declare(pt.str(name), exp_matcher(t), span),
    "stmt:check": ({ exp, t }, { span }) =>
      new Stmts.Check(exp_matcher(exp), exp_matcher(t), span),
  })(tree)
}
