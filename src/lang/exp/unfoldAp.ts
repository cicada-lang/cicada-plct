import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldAp(target: Exp, args: Array<Exps.Arg>): Exp {
  if (args.length === 0) return target

  const [arg, ...restArgs] = args

  switch (arg.kind) {
    case "ArgPlain": {
      return unfoldAp(Exps.Ap(target, arg.exp), restArgs)
    }

    case "ArgImplicit": {
      throw new ElaborationError(
        `unfoldAp is not implemented for exp: ${arg.kind}`,
      )
    }
  }
}
