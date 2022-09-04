import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function unfoldSequence(
  entries: Array<Exps.SequenceEntry>,
  ret: Exp,
): Exp {
  if (entries.length === 0) return ret

  const [entry, ...restEntries] = entries

  switch (entry.kind) {
    case "SequenceLet": {
      throw new Error("TODO")
    }

    case "SequenceLetThe": {
      throw new Error("TODO")
    }

    case "SequenceCheck": {
      throw new Error("TODO")
    }
  }
}
