import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"

/**

   `unfoldAp` can normalize `f(x)(y)` to `f(x, y)`.

**/

export function unfoldAp(
  exp: Exp,
  args: Array<Exps.Arg> = [],
): { target: Exp; args: Array<Exps.Arg> } {
  switch (exp["@kind"]) {
    case "Ap": {
      return unfoldAp(exp.target, [Exps.ArgPlain(exp.arg), ...args])
    }

    case "ApImplicit": {
      return unfoldAp(exp.target, [Exps.ArgImplicit(exp.arg), ...args])
    }

    case "ApUnfolded": {
      return unfoldAp(exp.target, [...exp.args, ...args])
    }

    default: {
      return { target: exp, args }
    }
  }
}
