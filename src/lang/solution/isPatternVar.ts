import { PatternVar } from "../solution"
import { Value } from "../value"

export function isPatternVar(value: Value): value is PatternVar {
  return value.kind === "TypedNeutral" && value.neutral.kind === "Var"
}
