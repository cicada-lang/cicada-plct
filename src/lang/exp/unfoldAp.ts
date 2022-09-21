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
      return unfoldAp(Exps.ApImplicit(target, arg.exp), restArgs)
    }
  }
}
