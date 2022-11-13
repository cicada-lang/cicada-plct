import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import { Value } from "../value"

/**

   We use neutral variable as meta variable (or say logic variable).

**/

export type MetaVar = {
  family: "Value"
  kind: "TypedNeutral"
  type: Value
  neutral: Neutrals.Var
}

export function MetaVar(type: Value, neutral: Neutrals.Var): MetaVar {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral,
  }
}

export function isMetaVar(solution: Solution, value: Value): value is MetaVar {
  if (value.kind !== "TypedNeutral") return false
  if (value.neutral.kind !== "Var") return false
  const name = value.neutral.name
  return Boolean(
    solution.metaVars.find((metaVar) => metaVar.neutral.name === name),
  )
}

export function solutionMetaVar(
  solution: Solution,
  metaVar: MetaVar,
): Solution {
  solution.metaVars.push(metaVar)
  return solution
}
