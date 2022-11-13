import * as Neutrals from "../neutral"
import { PatternVar } from "../solution"
import { Value } from "../value"

export class Solution {
  patternVars: Array<PatternVar> = []
  bindings: Map<string, Value> = new Map()

  createPatternVar(name: string, type: Value): PatternVar {
    const patternVar = PatternVar(type, Neutrals.Var(name))
    this.patternVars.push(patternVar)
    return patternVar
  }

  isPatternVar(value: Value): value is PatternVar {
    if (value.kind !== "TypedNeutral") return false
    if (value.neutral.kind !== "Var") return false
    const name = value.neutral.name
    return Boolean(
      this.patternVars.find((patternVar) => patternVar.neutral.name === name),
    )
  }

  lookupValue(name: string): Value | undefined {
    const value = this.bindings.get(name)
    if (value === undefined) return undefined
    if (this.isPatternVar(value) && value.neutral.name === name)
      return undefined
    return value
  }

  walk(value: Value): Value {
    while (this.isPatternVar(value)) {
      const found = this.lookupValue(value.neutral.name)
      if (found === undefined) return value
      value = found
    }

    return value
  }
}
