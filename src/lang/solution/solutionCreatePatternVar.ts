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

export function PatternVar(type: Value, neutral: Neutrals.Var): PatternVar {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral,
  }
}

export function isPatternVar(
  solution: Solution,
  value: Value,
): value is PatternVar {
  if (value.kind !== "TypedNeutral") return false
  if (value.neutral.kind !== "Var") return false
  const name = value.neutral.name
  return Boolean(
    solution.patternVars.find((patternVar) => patternVar.neutral.name === name),
  )
}

export function solutionCreatePatternVar(
  solution: Solution,
  patternVar: PatternVar,
): void {
  solution.patternVars.push(patternVar)
}
