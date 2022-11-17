import * as pt from "@cicada-lang/partech"
import * as matchers from "."
import type { Exp } from "../../exp"

export function equivalent_rest_entry_matcher(tree: pt.Tree): {
  via: Exp
  to: Exp
} {
  return pt.matcher<{ via: Exp; to: Exp }>({
    "equivalent_rest_entry:via": ({ via, to }, { span }) => ({
      via: matchers.exp_matcher(via),
      to: matchers.exp_matcher(to),
    }),
  })(tree)
}
