import type { Exp } from "../exp"
import * as Exps from "../exp"

export function foldSequence(
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
        foldSequence(restBindings, ret),
        // spanUnion(binding.span, ret.span),
        ret.span,
      )
    }

    case "SequenceBindingLetThe": {
      return Exps.SequenceLetThe(
        binding.name,
        binding.type,
        binding.exp,
        foldSequence(restBindings, ret),
        // spanUnion(binding.span, ret.span),
        ret.span,
      )
    }

    case "SequenceBindingCheck": {
      return Exps.SequenceCheck(
        binding.exp,
        binding.type,
        foldSequence(restBindings, ret),
        // spanUnion(binding.span, ret.span),
        ret.span,
      )
    }
  }
}
