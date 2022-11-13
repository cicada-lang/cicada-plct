import { PatternVar } from "../solution"
import { Value } from "../value"

export class Solution {
  patternVars: Array<PatternVar> = []
  bindings: Map<string, Value> = new Map()

  isPatternVar(value: Value): value is PatternVar {
    if (value.kind !== "TypedNeutral") return false
    if (value.neutral.kind !== "Var") return false
    const name = value.neutral.name
    return Boolean(
      this.patternVars.find((patternVar) => patternVar.neutral.name === name),
    )
  }
}
