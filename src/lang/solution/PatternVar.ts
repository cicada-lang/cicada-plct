import * as Neutrals from "../neutral"
import { Value } from "../value"

/**

   # PatternVar

   We use neutral variable as pattern variable (or say logic variable).

**/

export type PatternVar = {
  family: "Value"
  kind: "TypedNeutral"
  type: Value
  neutral: Neutrals.Var
}

export function PatternVar(type: Value, neutral: Neutrals.Var): PatternVar {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral,
  }
}
