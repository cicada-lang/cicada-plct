import * as Neutrals from "../neutral"
import { PatternVar } from "../solution"
import { Value } from "../value"

export function createPatternVar(type: Value, name: string): PatternVar {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral: Neutrals.Var(name),
  }
}
