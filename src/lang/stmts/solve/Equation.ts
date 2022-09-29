import { Exp } from "../../exp"

export type Equation = EquationUnifyTyped | EquationUnify

export type EquationUnifyTyped = {
  kind: "EquationUnifyTyped"
  left: Exp
  right: Exp
  type: Exp
}

export function EquationUnifyTyped(left: Exp, right: Exp, type: Exp): EquationUnifyTyped {
  return {
    kind: "EquationUnifyTyped",
    left,
    right,
    type,
  }
}

export type EquationUnify = {
  kind: "EquationUnify"
  left: Exp
  right: Exp
}

export function EquationUnify(left: Exp, right: Exp): EquationUnify {
  return {
    kind: "EquationUnify",
    left,
    right,
  }
}
