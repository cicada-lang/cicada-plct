import * as Neutrals from "../neutral"
import { PatternVar, Solution } from "../solution"
import { Value } from "../value"

export function solutionCreatePatternVar(
  solution: Solution,
  name: string,
  type: Value,
): PatternVar {
  const patternVar = PatternVar(type, Neutrals.Var(name))
  solution.patternVars.push(patternVar)
  return patternVar
}
