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

export function createPatternVar(type: Value, name: string): PatternVar {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral: Neutrals.Var(name),
  }
}

export function isPatternVar(value: Value): value is PatternVar {
  return value.kind === "TypedNeutral" && value.neutral.kind === "Var"
}
