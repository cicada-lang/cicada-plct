import { ElaborationError } from "../errors"
import * as Exps from "./Exp"
import { Exp } from "./Exp"

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
