import { ElaborationError } from "../errors"
import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function foldMultiFn(bindings: Array<Exps.FnBinding>, ret: Exp): Exp {
  if (bindings.length === 0) return ret

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "FnBindingName": {
      return Exps.Fn(binding.name, foldMultiFn(restBindings, ret))
    }

    case "FnBindingAnnotated": {
      throw new ElaborationError(
        `foldMultiFn is not implemented for exp: ${binding.kind}`
      )
    }
  }
}

export function foldMultiPi(
  bindings: Array<Exps.PiBinding>,
  retType: Exp
): Exp {
  if (bindings.length === 0) return retType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "PiBindingNameless": {
      return Exps.Pi("_", binding.type, foldMultiPi(restBindings, retType))
    }

    case "PiBindingNamed": {
      return Exps.Pi(
        binding.name,
        binding.type,
        foldMultiPi(restBindings, retType)
      )
    }
  }
}

export function foldMultiAp(target: Exp, args: Array<Exps.Arg>): Exp {
  if (args.length === 0) return target

  const [arg, ...restArgs] = args

  switch (arg.kind) {
    case "ArgPlain": {
      return foldMultiAp(Exps.Ap(target, arg.exp), restArgs)
    }

    case "ArgImplicit": {
      throw new ElaborationError(
        `foldMultiAp is not implemented for exp: ${arg.kind}`
      )
    }

    case "ArgVague": {
      throw new ElaborationError(
        `foldMultiAp is not implemented for exp: ${arg.kind}`
      )
    }
  }
}

export function foldMultiSigma(
  bindings: Array<Exps.SigmaBinding>,
  cdrType: Exp
): Exp {
  if (bindings.length === 0) return cdrType

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "SigmaBindingNameless": {
      return Exps.Sigma(
        "_",
        binding.type,
        foldMultiSigma(restBindings, cdrType)
      )
    }

    case "SigmaBindingNamed": {
      return Exps.Sigma(
        binding.name,
        binding.type,
        foldMultiSigma(restBindings, cdrType)
      )
    }
  }
}
