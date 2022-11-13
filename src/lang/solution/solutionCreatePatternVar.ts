import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import { Value } from "../value"

/**

   We use neutral variable as pattern variable (or say logic variable).

**/

export type PatternVar = {
  family: "Value"
  kind: "TypedNeutral"
  type: Value
  neutral: Neutrals.Var
}

function PatternVar(type: Value, neutral: Neutrals.Var): PatternVar {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral,
  }
}

export function solutionCreatePatternVar(
  solution: Solution,
  name: string,
  type: Value,
): PatternVar {
  const patternVar = PatternVar(type, Neutrals.Var(name))
  solution.patternVars.push(patternVar)
  return patternVar
}
