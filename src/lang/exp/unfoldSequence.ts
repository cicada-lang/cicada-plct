import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldSequence(
  bindings: Array<Exps.SequenceBinding>,
  ret: Exp,
): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "SequenceBindingLet": {
      return Exps.SequenceLet(
        binding.name,
        binding.exp,
        unfoldSequence(restBindings, ret),
      )
    }

    case "SequenceBindingLetThe": {
      return Exps.SequenceLetThe(
        binding.name,
        binding.type,
        binding.exp,
        unfoldSequence(restBindings, ret),
      )
    }

    case "SequenceBindingCheck": {
      return Exps.Check(
        binding.exp,
        binding.type,
        unfoldSequence(restBindings, ret),
      )
    }
  }
}
