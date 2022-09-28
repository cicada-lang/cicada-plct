import { Exp } from "../exp"

export function freeNames(boundNames: Set<string>, exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var": {
      return boundNames.has(exp.name) ? new Set() : new Set([exp.name])
    }

    default: {
      // TODO
      return new Set()
    }
  }
}
