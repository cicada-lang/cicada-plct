import * as Exps from "../exp"
import { Exp } from "../exp"

/**

   `foldAp` can normalize `f(x)(y)` to `f(x, y)`.

**/

export function foldAp(
  exp: Exp,
  args: Array<Exps.Arg> = [],
): { target: Exp; args: Array<Exps.Arg> } {
  switch (exp.kind) {
    case "Ap": {
      return foldAp(exp.target, [Exps.ArgPlain(exp.arg), ...args])
    }

    case "ApImplicit": {
      return foldAp(exp.target, [Exps.ArgImplicit(exp.arg), ...args])
    }

    case "ApFolded": {
      return foldAp(exp.target, [...exp.args, ...args])
    }

    default: {
      return { target: exp, args }
    }
  }
}
