import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function sequence_matcher(tree: pt.Tree): Exps.Sequence {
  return pt.matcher({
    "sequence:sequence": ({ entries, ret }, { span }) =>
      Exps.Sequence(
        pt.matchers.zero_or_more_matcher(entries).map(sequence_entry_matcher),
        matchers.exp_matcher(ret),
        span,
      ),
  })(tree)
}

export function sequence_entry_matcher(tree: pt.Tree): Exps.SequenceEntry {
  return pt.matcher<Exps.SequenceEntry>({
    "sequence_entry:let": ({ name, exp }, { span }) =>
      Exps.SequenceLet(pt.str(name), matchers.exp_matcher(exp)),
    "sequence_entry:let_the": ({ name, t, exp }, { span }) =>
      Exps.SequenceLetThe(
        pt.str(name),
        matchers.exp_matcher(t),
        matchers.exp_matcher(exp),
      ),
    "sequence_entry:check": ({ exp, t }, { span }) =>
      Exps.SequenceCheck(matchers.exp_matcher(exp), matchers.exp_matcher(t)),
  })(tree)
}
