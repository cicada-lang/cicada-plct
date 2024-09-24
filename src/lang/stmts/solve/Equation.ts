import type { Exp } from "../../exp/index.js"
import type { Span } from "../../span/index.js"

export type Equation = EquationUnifyTyped | EquationUnify

export type EquationUnifyTyped = {
  "@kind": "EquationUnifyTyped"
  left: Exp
  right: Exp
  type: Exp
  span?: Span
}

export function EquationUnifyTyped(
  left: Exp,
  right: Exp,
  type: Exp,
  span?: Span,
): EquationUnifyTyped {
  return {
    "@kind": "EquationUnifyTyped",
    left,
    right,
    type,
    span,
  }
}

export type EquationUnify = {
  "@kind": "EquationUnify"
  left: Exp
  right: Exp
  span?: Span
}

export function EquationUnify(
  left: Exp,
  right: Exp,
  span?: Span,
): EquationUnify {
  return {
    "@kind": "EquationUnify",
    left,
    right,
    span,
  }
}
