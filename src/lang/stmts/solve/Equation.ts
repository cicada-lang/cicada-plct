import { Exp } from "../../exp"

export type Equation = EquationTyped | EquationUntyped

export type EquationTyped = {
  kind: "EquationTyped"
  left: Exp
  right: Exp
  type: Exp
}

export function EquationTyped(left: Exp, right: Exp, type: Exp): EquationTyped {
  return {
    kind: "EquationTyped",
    left,
    right,
    type,
  }
}

export type EquationUntyped = {
  kind: "EquationUntyped"
  left: Exp
  right: Exp
}

export function EquationUntyped(left: Exp, right: Exp): EquationUntyped {
  return {
    kind: "EquationUntyped",
    left,
    right,
  }
}
