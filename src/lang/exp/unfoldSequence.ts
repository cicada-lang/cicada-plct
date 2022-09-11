import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldSequence(
  bindings: Array<Exps.SequenceBinding>,
  ret: Exp,
): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "SequenceLet": {
      return Exps.Let(
        binding.name,
        binding.exp,
        unfoldSequence(restBindings, ret),
      )
    }

    case "SequenceLetThe": {
      return Exps.LetThe(
        binding.name,
        binding.type,
        binding.exp,
        unfoldSequence(restBindings, ret),
      )
    }

    case "SequenceCheck": {
      return Exps.Check(
        binding.exp,
        binding.type,
        unfoldSequence(restBindings, ret),
      )
    }
  }
}
