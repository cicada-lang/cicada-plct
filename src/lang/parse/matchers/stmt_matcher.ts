import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import { Stmt } from "../../stmt"
import * as Stmts from "../../stmts"
import * as matchers from "../matchers"

export function stmt_matcher(tree: pt.Tree): Stmt {
  return pt.matcher<Stmt>({
    "stmt:check": ({ exp, t }, { span }) =>
      new Stmts.Check(matchers.exp_matcher(exp), matchers.exp_matcher(t), span),
    "stmt:let": ({ name, exp }, { span }) =>
      new Stmts.Let(pt.str(name), matchers.exp_matcher(exp), span),
    "stmt:let_the": ({ name, t, exp }, { span }) =>
      new Stmts.LetThe(
        pt.str(name),
        matchers.exp_matcher(t),
        matchers.exp_matcher(exp),
        span,
      ),
    "stmt:let_function": ({ name, bindings, ret_t, sequence }, { span }) =>
      new Stmts.LetThe(
        pt.str(name),
        Exps.FoldedPi(
          matchers.pi_bindings_matcher(bindings),
          matchers.exp_matcher(ret_t),
          span,
        ),
        Exps.FoldedFn(
          matchers
            .pi_bindings_matcher(bindings)
            .map(matchers.piBindingtoFnBindingFrom),
          matchers.sequence_matcher(sequence),
          span,
        ),
        span,
      ),
    "stmt:compute": ({ exp }, { span }) =>
      new Stmts.Compute(matchers.exp_matcher(exp), span),
    "stmt:clazz": ({ name, bindings }, { span }) =>
      new Stmts.Clazz(
        pt.str(name),
        Exps.FoldedClazz(
          pt.matchers
            .zero_or_more_matcher(bindings)
            .map(matchers.clazz_binding_matcher),
          span,
        ),
        span,
      ),
    "stmt:conversion": ({ type, exps, last_exp }, { span }) =>
      new Stmts.Conversion(
        matchers.exp_matcher(type),
        [
          ...pt.matchers.zero_or_more_matcher(exps).map(matchers.exp_matcher),
          matchers.exp_matcher(last_exp),
        ],
        span,
      ),
    "stmt:inclusion": ({ types, last_type }, { span }) =>
      new Stmts.Inclusion(
        [
          ...pt.matchers.zero_or_more_matcher(types).map(matchers.exp_matcher),
          matchers.exp_matcher(last_type),
        ],
        span,
      ),
  })(tree)
}

export function stmts_matcher(tree: pt.Tree): Array<Stmt> {
  return pt.matcher({
    "stmts:stmts": ({ stmts }) =>
      pt.matchers.zero_or_more_matcher(stmts).map(stmt_matcher),
  })(tree)
}
