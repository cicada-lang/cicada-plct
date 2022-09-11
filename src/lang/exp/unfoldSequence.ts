import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldSequence(
  bindings: Array<Exps.SequenceBinding>,
  ret: Exp,
): Exp {
  if (bindings.length === 0) return ret

  const [entry, ...restEntries] = bindings

  switch (entry.kind) {
    case "SequenceLet": {
      return Exps.Let(entry.name, entry.exp, ret)
    }

    case "SequenceLetThe": {
      return Exps.LetThe(entry.name, entry.type, entry.exp, ret)
    }

    case "SequenceCheck": {
      return Exps.Check(entry.exp, entry.type, ret)
    }
  }
}
